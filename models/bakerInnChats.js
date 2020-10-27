const mongo = require('mongodb')
const bcrypt = require("bcrypt")
const saltRounds = 10;
const ObjectId = mongo.ObjectId

module.exports = (db) => {

    //create new chat and then push to both users 'chats'
    let newChat = (newChatInfo, callback) => {

        let allQueries = []
        let listingID = newChatInfo.listing_id
        let userID = newChatInfo.buyer_id

        allQueries.push(db.collection("listings").updateOne({ _id: ObjectId(listingID) }, { $push: { interested: userID } })
            .then(res => res)
            .catch(err => callback(err, null)))


        allQueries.push(db.collection("chats").insertOne(newChatInfo)
            .then(res=> {
                let queries = [res]

                 queries.push(db.collection("users").updateMany(
                    {_id:
                        {
                            $in: [ ObjectId(newChatInfo.owner_id),
                            ObjectId(newChatInfo.buyer_id) ]
                        }
                    },
                    { $push: { chats: { chat_id: res.insertedId, notifications: 0, updated_at: 0 } }})
                        .then(res1 => res1))

                 return Promise.all(queries)
            })
            .then(res2=> res2)
            .catch(err => callback(err, null)))

        Promise.all(allQueries) //returns an array [[res from update listing], [[new chat info], [res from updating users]]]
            .then(res => callback(null, res))
            .catch(err => callback(err, null))
    }

    let postMessage = (newMessageInfo, callback) => {
        let allQueries = []

        //update user's chats updated_at
        allQueries.push(db.collection("users").updateOne({_id: ObjectId(newMessageInfo.user_id), "chats.chat_id": ObjectId(newMessageInfo.chat_id) }, {$set: {"chats.$.updated_at": new Date()}} )
            .then(res => res)
            .catch(err => {throw err}))

        //post message to messages
        allQueries.push(db.collection("messages").insertOne(newMessageInfo)
            .then(res => res)
            .catch(err => {throw err}))

        Promise.all(allQueries)
            .then(res => {callback(null, res)})
            .catch(err => {callback(err, null)})
    }

    //chat info as well as listing name, owner username and buyer username
    let getChatInfo = (chatID, callback) => {
        db.collection("chats").findOne({_id: ObjectId(chatID)})
            .then(res => {
                let allQueries = [res]
                let ownerID = res.owner_id
                let buyerID = res.buyer_id
                let listingID = res.listing_id

                let queryParams = [
                {
                    fields: ["username"],
                    table: "users",
                    id: ownerID
                },
                {
                    fields:[ "username"],
                    table: "users",
                    id: buyerID
                },
                {
                    fields: ["item", "state", "option", "buyer_id"],
                    table: "listings",
                    id: listingID
                }]


                queryParams.forEach((item) => {
                    allQueries.push(
                        db.collection(item.table).findOne({_id: ObjectId(item.id)})
                            .then(res => {
                                let resultArray = item.fields.map((field)=>{
                                    if(res){
                                        return res[field]
                                    } else {
                                        return null
                                    }
                                })
                                return resultArray
                            })
                            .catch(err => {throw err}))

                })


                return Promise.all(allQueries) //returns a list with [chatInfo, ownerName, buyerName, listingName, listingState, listingOption]

            })
            .then(res1 => {
                res1[0].owner_username = res1[1][0]
                res1[0].buyer_username = res1[2][0]
                res1[0].listing_item = res1[3][0]
                res1[0].listing_state = res1[3][1]
                res1[0].listing_option = res1[3][2]
                res1[0].successful_buyer_id = res1[3][3]
                callback(null, res1[0])
            })
            .catch(err => {callback(err, null)})
    }


    let getChatMessages = (chat_id, callback) => {
        db.collection("messages").find({chat_id: chat_id}).sort({ _id: 1}).toArray()
            .then(res => {
                let allQueries = []
                let senderNames = [] //store sender names of chat - once there are 2 stop querying the database and just compare against stored values
                res.forEach((message)=>{
                    if(senderNames.length < 2){
                        allQueries.push(
                            db.collection("users").findOne({_id: ObjectId(message.user_id)})
                                .then(res1 => {
                                    senderNames.push({sender_name: res1.username, sender_id: res1._id})
                                    message.sender_name = res1.username
                                    return message
                                })
                        )
                    } else if (senderNames.length == 2){
                        message.sender_name = message.user_id==senderNames[0].sender_id ? senderNames[0].sender_name : senderNames[1].sender_name

                    }

                })
                return Promise.all(allQueries)
            })
            .then(res => callback(null, res))
            .catch(err => callback(err, null))

    }

    //find one chat
    let getChatId = (chatInfo, callback) => {
        db.collection("chats").findOne(chatInfo)
            .then(res=>callback(null, res))
            .catch(err=>callback(err, null))
    }

    let updateNotifications = (queryInfo, callback) => {
        if(queryInfo.action=="clear"){
            db.collection("users").updateOne({_id: ObjectId(queryInfo.receiver_id), "chats.chat_id": ObjectId(queryInfo.chat_id) }, {$set: {"chats.$.notifications": 0}} )
                .then(res=>{callback(null, res)})
                .catch(err=>{callback(err, null)})

        } else if(queryInfo.action=="increment"){
            db.collection("users").updateOne({_id: ObjectId(queryInfo.receiver_id), "chats.chat_id": ObjectId(queryInfo.chat_id) }, {$inc: {"chats.$.notifications": 1}, $set: {"chats.$.updated_at": queryInfo.updated_at}} )
                .then(res=>{
                    console.log("Chat notification incremented.")
                    callback(null, res)})
                .catch(err=>{callback(err, null)})


        }


    }

    return {
        newChat,
        postMessage,
        getChatInfo,
        getChatMessages,
        getChatId,
        updateNotifications

    }

}