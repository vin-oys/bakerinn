const jwt = require('jsonwebtoken')
const secret = "youGuess"

module.exports = (db) => {

    let modelChatFuncs = db.modelChatFuncsObj

    //request body must contain listing id, borrower id and owner id.
    let createChat = (request, response) => {
        let newChatInfo = request.body
        newChatInfo.buyer_id = request.userId
        console.log(newChatInfo)
        modelChatFuncs.newChat(newChatInfo, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred in create chat")
            } else {
                response.status(200).send(res[1][0])
            }
        })
    }

    //request body must contain message text, sender_id and chat_id
    let postMessage = (request, response) => {
        let messageInfo = request.body
        modelChatFuncs.postMessage(messageInfo, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred. - in posting message ")
            } else {
                response.status(200).send("New message successfully posted.")
            }
        })
    }

    let getChat = (request, response) => {
        let chat_id = request.params.id
        modelChatFuncs.getChatInfo(chat_id, (err, res) => {
            if (err) {
                console.log(err);
                response.status(500).send("Error occurred. - in getting chat info")
            } else {
                response.status(200).send(res)
            }
        })
    }

    let getMessages = (request, response) => {
        let chat_id = request.params.id
        modelChatFuncs.getChatMessages(chat_id, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred - in getting messages")
            } else {
                response.status(200).send(res)
            }
        })
    }

    let getChatIdByInfo = (request, response) => {
        let chatInfo = {
            owner_id: request.params.ownerid,
            buyer_id: request.userId,
            listing_id: request.params.listingid

        }
        console.table(chatInfo);
        modelChatFuncs.getChatId(chatInfo, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred. - in getChatIdByInfo")
            }
            else {
                console.log(res, '-- getChatIdByInfo');
                if (res) {
                    response.status(200).send(res)
                } else {
                    response.status(404).send('chat not found')
                }
            }
        })
    }


    let getChatIdsByInfo = (request, response) => {
        let chatInfo = {
            buyer_id: request.params.buyerid,
            owner_id: request.userId,
            listing_id: request.params.listingid

        }
        modelChatFuncs.getChatId(chatInfo, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred. - in getChatIdsByInfo")
            }
            else {
                console.log(res, '-- getChatIdsByInfo');
                response.status(200).send(res)
            }
        })
    }

    let updateNotifications = (request, response)=>{
        let queryInfo = request.body
        queryInfo.updated_at=new Date()
        modelChatFuncs.updateNotifications(queryInfo, (err, res)=>{
            if(err){
                console.log(err, "---error in updating notifications")
                response.status(500).send("Error occurred.")
            } else {
                response.status(200).send(res)
            }
        })

    }


    return {
        createChat,
        postMessage,
        getChat,
        getMessages,
        getChatIdByInfo,
        getChatIdsByInfo,
        updateNotifications

    }

}