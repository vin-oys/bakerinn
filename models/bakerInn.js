const mongo = require('mongodb')
const bcrypt = require("bcrypt")
const saltRounds = 10;
const ObjectId = mongo.ObjectId

module.exports = (db) => {

    let getAllUsers = (callback) => {
        db.collection("users").aggregate([{ $project: { password: 0 } }]).toArray()
            .then(res => {
                callback(null, res)
            })
            .catch(err => {
                callback(err, null)
            })
    }

    let getUserFromID = (userID, callback) => {
        db.collection("users").findOne({ _id: ObjectId(userID) })
            .then(res => {
                delete res.password
                callback(null, res)
            })
            .catch(err => {
                callback(err, null)
            })
    }

    let createNewUser = async (userInfo, callback) => {
        let emailResult = await db.collection("users").find({ email: userInfo.email }).toArray()
        let usernameResult = await db.collection("users").find({ username: userInfo.username }).toArray()
        if (emailResult.length > 0) {
            let error = "email has been taken"
            callback(error, null)
        } else if (usernameResult.length > 0) {
            let error = "username has been taken"
            callback(error, null)
        } else {
            // hashing password before storing into db
            bcrypt.hash(userInfo.password, saltRounds, (err, hash) => {
                if (err) {
                    console.log("error in password hashing")
                    callback(err, null)
                } else {
                    let hashedData = {
                        email: userInfo.email,
                        username: userInfo.username,
                        password: hash
                    }
                    db.collection("users").insertOne(hashedData)
                        .then(res => {
                            console.log(res)
                            let output = `welcome ${hashedData.username}`
                            callback(null, output)
                        })
                        .catch(err => {
                            console.log("err in createNewUser model", err)
                            callback(err, null)
                        })
                }
            })
        }
    }

    let userLogin = async (userLoginInfo, callback) => {
        let emailResult = await db.collection("users").find({ email: userLoginInfo.email }).toArray()

        // result returns true if the password matches
        try {
            bcrypt.compare(userLoginInfo.password, emailResult[0].password, (err, result) => {
                if (err) {
                    console.log("err in userLogin model", err)
                    callback(err, null)
                } else {
                    let data = {
                        email: emailResult[0].email,
                        username: emailResult[0].username,
                        id: emailResult[0]._id,
                        result
                    }
                    callback(null, data)
                }
            })
        } catch (err) {
            callback(true, null)
        }

    }

    // let updateUserInfo = (updatedInfo, userID, callback) => {
    //     db.collection("users").updateOne({ _id: ObjectId(userID) }, { $set: updatedInfo })
    //         .then(res => {
    //             callback(null, res)
    //         })
    //         .catch(err => {
    //             callback(err, null)
    //         })
    // }

    // let deleteUser = (userID, callback) => {
    //     db.collection("users").deleteOne({ _id: ObjectId(userID) })
    //         .then(res => {
    //             callback(null, res)
    //         })
    //         .catch(err => {
    //             callback(err, null)
    //         })
    // }

    let getAllListings = (callback) => {
        db.collection("listings").find({}).toArray()
            .then(res => {
                callback(null, res)
            })
            .catch(err => {
                callback(err, null)
            })

    }

    //put the new listing in listings collection, add listing to user info.
    let makeNewListing = (newListingInput, userID, callback) => {
        db.collection("listings").insertOne(newListingInput)
            .then(res => {
                let allQueries = [res.insertedId]
                allQueries.push(db.collection("users").updateOne({ _id: ObjectId(userID) }, { $push: { listings: res.insertedId }}))
                return Promise.all(allQueries)
            })
            .then(res => callback(null, res[0]))
            .catch(err => callback(err, null))
    }

    //get a user's posted listings or borrowed listings, depending on value of 'borrowed' (T/F) argument
    let getUserListing = (userID, borrowed, callback) => {
        db.collection("users").findOne({ _id: ObjectId(userID) })
            .then(res => { //the user object whose listings you're trying to retrieve

                let userListings = borrowed ? res.borrowed : res.listings
                let allQueries = []

                if (userListings) {
                    userListings.forEach((listingID) => {
                        allQueries.push(
                            db.collection("listings").findOne({ _id: ObjectId(listingID) })
                                .then(res1 => { //res1 is the listing object from listings collection
                                    if (res1.state === "available" && !borrowed) {
                                        let allSubQueries = []

                                        allSubQueries.push(res1)
                                        allSubQueries.push(db.collection("users").findOne({ _id: ObjectId(res1.owner_id) }))

                                        return Promise.all(allSubQueries)
                                    } else if (res1.state === "on loan" && borrowed) {
                                        let allSubQueries = []

                                        allSubQueries.push(res1)
                                        allSubQueries.push(db.collection("users").findOne({ _id: ObjectId(res1.owner_id) }))

                                        return Promise.all(allSubQueries)
                                    } else {
                                        return null
                                    }

                                })
                                .then(res2 => { //res2 is a list [listingobject, userobject]
                                    if (res2) {
                                        res2[0].owner_info = { username: res2[1].username }
                                        return res2[0]
                                    } else {
                                        return null
                                    }

                                })
                                .catch(err => { throw err })
                        )
                    })
                }
                return Promise.all(allQueries)
            })
            .then(allListings => { return allListings.filter(x => x) }) // filter out the null
            .then(listing => { callback(null, listing) }) //a list of containing objects, where each object represents a listing.
            .catch(err => { callback(err, null) })
    }


    let getOneListing = (listingID, callback) => {
        db.collection("listings").findOne({ _id: ObjectId(listingID) })
            .then(res => {

                let allQueries = []

                allQueries.push(res)
                allQueries.push(db.collection("users").findOne({ _id: ObjectId(res.owner_id) }))

                return Promise.all(allQueries)
            })
            .then(res1 => {

                res1[0].owner_info = { username: res1[1].username, user_id: res1[1]._id }

                callback(null, res1[0])
            })
            .catch(err => callback(err, null))

    }

    //add user interest to listing.
    let expressInterest = (listingID, userID, callback) => {
        db.collection("listings").updateOne({ _id: ObjectId(listingID) }, { $push: { interested: userID } })
            .then(res => {
                callback(null, res)
            })
            .catch(err => { callback(err, null) })

    }

    // update listing info
    let updateListingInfo = (updatedInfo, listingID, callback) => {
        db.collection("listings").updateOne({ _id: ObjectId(listingID) }, { $set: updatedInfo })
            .then(res => {
                callback(null, res)
            })
            .catch(err => {
                callback(err, null)
            })
    }

    let deleteListing = (listingID, callback) => {
        db.collection("users").updateMany(
            {},
            { $pull: { listings: ObjectId(listingID) } },
            { multi: true }
        )
            .then(res => {
                callback(null, res)
            })
            .catch(err => {
                callback(err, null)
            })
        db.collection("listings").deleteOne({ _id: ObjectId(listingID) })
            .then(res => {
                callback(null, res)
            })
            .catch(err => {
                callback(err, null)
            })
    }

    //update listing and either push to buyers borrowed, or bought, or remove from borrowed.
    let makeTransaction = (listingID, updateInfo, callback) => {

        let allQueries = []

        if (updateInfo.state == "on loan") {

            allQueries.push(db.collection("users").updateOne({ _id: ObjectId(updateInfo.buyer_id) }, { $push: { borrowed: listingID } }))

        } else if (updateInfo.state == "available") {

            allQueries.push(db.collection("users").updateOne({ _id: ObjectId(updateInfo.previous_borrower_id) }, { $pull: { borrowed: listingID } }))

            delete updateInfo.previous_borrower_id


        } else if (updateInfo.state == "unavailable") {

            allQueries.push(db.collection("users").updateOne({ _id: ObjectId(updateInfo.buyer_id) }, { $push: { bought: listingID } }))
        }

        //update listing
        allQueries.push(db.collection("listings").updateOne({ _id: ObjectId(listingID) }, { $set: updateInfo }))


        Promise.all(allQueries)
            .then(res => callback(null, res))
            .catch(err => callback(err, null))
    }



    let searchDatabase = (queryWords, table, callback) => {
        // let query = queryWords.join(" | ")
        // console.log(query)
        let regex = []
        queryWords.forEach((item)=>{
            regex.push(new RegExp(item, 'i'))
        })

        if(table==="users"){
            db.collection(table).find({$or: [{username: { $in: regex}}, {email: { $in: regex}}]}).toArray()
                .then(res => callback(null, res))
                .catch(err => callback(err, null))

        } else if (table==="listings"){
            db.collection(table).find({ $or: [{item: { $in: regex}}, {description: { $in: regex}}]}).toArray()
                .then(res => callback(null, res))
                .catch(err => callback(err, null))

        }
    }



    // get all user's current loan to listings
    // loan to listing state is unavailable
    let getUserLoanTo = (userID, callback) => {
        console.log("USERID IN MODAL", userID)
        db.collection("users").findOne({ _id: ObjectId(userID) })
            .then(res => { //the user object whose listings you're trying to retrieve

                let userListings = res.listings
                let allQueries = []

                console.log("ALLQUERIES", userListings)

                if (userListings) {
                    userListings.forEach((listingID) => {
                        allQueries.push(
                            db.collection("listings").findOne({ _id: ObjectId(listingID) })
                                .then(res1 => { //res1 is the listing object from listings collection
                                    if (res1.state === "on loan" && res1.category === "equipment") {
                                        let allSubQueries = []

                                        allSubQueries.push(res1)
                                        allSubQueries.push(db.collection("users").findOne({ _id: ObjectId(res1.buyer_id) }))

                                        return Promise.all(allSubQueries)
                                    } else {
                                        return null
                                    }
                                })

                                .then(res2 => { //res2 is a list [listingobject, userobject]
                                    if (res2) {
                                        console.log("RES2", res2)
                                        res2[0].buyer_info = { username: res2[1].username }
                                        return res2[0]
                                    } else {
                                        return null
                                    }
                                })
                                .catch(err => { throw err })
                        )
                    })
                }
                return Promise.all(allQueries)
            })
            .then(allListings => { return allListings.filter(x => x) }) // filter out the null
            .then(listing => { console.log("LISTINGS", listing); callback(null, listing) }) //a list of containing objects, where each object represents a listing.
            .catch((err) => { callback(err, null) })
    }


    return {
        getAllUsers,
        getUserFromID,
        createNewUser,
        // updateUserInfo,
        getAllListings,
        makeNewListing,
        getUserListing,
        getOneListing,
        userLogin,
        expressInterest,
        updateListingInfo,
        deleteListing,
        makeTransaction,
        searchDatabase,
        getUserLoanTo
    }
}