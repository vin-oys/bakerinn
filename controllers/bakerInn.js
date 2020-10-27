const { response } = require('express');
const jwt = require('jsonwebtoken')
require("dotenv").config();


const secret = process.env.SECRET

module.exports = (db) => {

    let modelFuncs = db.modelFuncsObj

    let ping = (request, response) => {
        response.send('server up and running');
    };

    let validate = (request, response) => {
        response.status(200).send('verified')
    };


    let getAllUsers = (request, response) => {
        modelFuncs.getAllUsers((err, res) => {
            if (err) {
                console.log(err.message)
                response.status(500).send("Error occurred - cannot get all users.")
            } else {
                response.status(200).send(res)
            }
        })
    }

    //for editing account information, must first get user information
    let getUser = (request, response) => {
        //some authentication here - only get this info if user is logged in.
        let userID = request.params.id
        modelFuncs.getUserFromID(userID, (err, res) => {
            if (err) {
                console.log(err.message)
                response.status(500).send("Error occurred.-- cannot get user info")
            } else {
                response.send(res)
            }
        })
    }

    let createUser = (request, response) => {
        let newUserInfo = request.body
        modelFuncs.createNewUser(newUserInfo, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send(err)
            } else {
                response.status(201).send('user created')
            }
        })
    }

    let login = (request, response) => {
        let userLoginInfo = request.body
        console.log("userLoginInfo", userLoginInfo)
        modelFuncs.userLogin(userLoginInfo, (err, res) => {
            if (err) {
                response.status(500).send("user not found")
            } else {
                if (res.result) {
                    // issue token
                    const payload = { email: res.email, username: res.username, userId: res.id };
                    // encode data into token
                    const token = jwt.sign(payload, secret)
                    response.cookie('token', token).sendStatus(200)
                    console.log("login successful")
                } else {
                    response.status(401).send('wrong password')
                }
            }
        })
    }

    let signout = (request, response)=>{
        response.clearCookie('token')
        response.send("Cookie cleared.")
    }

    // let editUser = (request, response) => {
    //     //some authentication required
    //     let updatedUserInfo = request.body
    //     let userID = request.userId
    //     modelFuncs.updateUserInfo(updatedUserInfo, userID, (err, res) => {
    //         if (err) {
    //             console.log(err)
    //             response.send("error occurred.")
    //         } else {
    //             response.send("Redirect to dashboard")
    //         }

    //     })
    // }

    // let deleteUser = (request, response) => {
    //     //some authentication required
    //     let userID = request.userId
    //     modelFuncs.deleteUser(userID, (err, res) => {
    //         if (err) {
    //             console.log(err)
    //             response.send("error occurred.")
    //         } else {
    //             response.send("Redirect to homepage.")
    //         }
    //     })

    // }

    let getAllListings = (request, response) => {
        modelFuncs.getAllListings((err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("error occurred. - cannot get all listings")
            } else {
                response.status(200).send(res)
            }
        })
    }

    let makeNewListing = (request, response) => {
        let newListingInput = request.body
        let userID = request.userId; //from cookies
        newListingInput.owner_id = userID
        newListingInput.state = "available"

        modelFuncs.makeNewListing(newListingInput, userID, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("error occurred. - cannot make new listing")
            } else {
                response.status(201).send(res)
            }
        })

    }

    let getUserListings = (request, response) => {
        let userID = request.params.userid
        modelFuncs.getUserListing(userID, false, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred. - cannot get user listings")
            } else {
                response.status(200).send(res)
            }
        })
    }

    //gets all of a user's currently borrowed listings.
    let getUserBorrowed = (request, response) => {
        //some authentication required - only a user can see their borrowed items
        let userID = request.userId
        if (userID == request.params.userid) {
            modelFuncs.getUserListing(userID, true, (err, res) => {
                if (err) {
                    console.log(err)
                    response.status(500).send("Error occurred. - cannot get user borrowed listings")
                } else {
                    response.status(200).send(res)
                }
            })
        } else {
            response.status(400).send("A user can only see their own borrowed items.")
        }
    }

    let getListingInfo = (request, response) => {
        let listingID = request.params.id
        modelFuncs.getOneListing(listingID, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred. - cannot get listing info")
            } else {
                response.status(200).send(res)
            }
        })
    }

    // let expressInterest = (request, response) => {
    //     let listingID = request.params.id
    //     let userID = request.userId
    //     modelFuncs.expressInterest(listingID, userID, (err, res) => {
    //         if (err) {
    //             console.log(err)
    //             response.status(500).send("Error occurred. - cannot express interest")
    //         } else {
    //             response.status(200).send("successfully expressed interest.")
    //         }


    //     })
    // }


    // edit listing info
    let editListing = (request, response) => {
        let listingID = request.params.id
        let updatedListingInfo = request.body
        modelFuncs.updateListingInfo(updatedListingInfo, listingID, (err, res) => {
            if (err) {
                console.log(err)
                response.send("error occurred.")
            } else {
                response.send("Update Listing successfully")
            }
        })
    }

    let deleteListing = (request, response) => {
        let listingID = request.params.id
        modelFuncs.deleteListing(listingID, (err, res) => {
            if (err) {
                console.log(err)
                response.send("error occurred.")
            } else {
                response.send("Redirect to homepage.")
            }
        })
    }

    let makeTransaction = (request, response) => {
        let listingID = request.params.id
        let updateInfo = request.body
        modelFuncs.makeTransaction(listingID, updateInfo, (err, res) => {
            if (err) {
                console.log(err)
                response.status(500).send("Error occurred. - cannot make unavailable")
            } else {
                response.status(200).send("Listing made unavailable")
            }
        })

    }

    let searchListings = (request, response) => {
        let queryParams = request.query.q.split(" ")
        let queryWords = []

        for(let i=0;i<queryParams.length;i++){
            if(queryParams[i]){

                queryWords.push(".*"+queryParams[i].split("").join(".*").replace(/y|ie|ee|ei|e/gi, "(y|ie|ee|ei|e)")+".*")

                let cutoffLength= queryParams[i].length > 3 ? 3 : 1

                queryWords.push(queryParams[i].slice(0, cutoffLength)+queryParams[i].slice(cutoffLength, queryParams[i].length).split("").join("?").replace(/y|ie|ee|ei|e/gi, "(y|ie|ee|ei|e)"))
            }
        }

        modelFuncs.searchDatabase(queryWords, "listings", (err, res)=>{
            if(err){
                console.log(err, "--- error in search function")
                response.status(500).send(err)
            } else {
                response.status(200).send(res)
            }
        })
    }


    let searchUsers = (request, response) => {
        let queryParams = request.query.q.split(" ")
        let queryWords = []

        for(let i=0;i<queryParams.length;i++){
            if(queryParams[i]){

                queryWords.push(".*"+queryParams[i].split("").join(".*").replace(/y|ie|ee|ei|e/gi, "(y|ie|ee|ei|e)")+".*")

                let cutoffLength= queryParams[i].length > 3 ? 3 : 1

                queryWords.push(queryParams[i].slice(0, cutoffLength)+queryParams[i].slice(cutoffLength, queryParams[i].length).split("").join("?").replace(/y|ie|ee|ei|e/gi, "(y|ie|ee|ei|e)"))
            }
        }

        modelFuncs.searchDatabase(queryWords, "users", (err, res)=>{
            if(err){
                console.log(err, "--- error in search function")
                response.status(500).send(err)
            } else {
                res.forEach((item)=>{
                    delete item.password
                })
                response.status(200).send(res)
            }
        })
    }

    // get all user's current loan to listings
    let getUserLoanTo = (request, response) => {
        let userID = request.userId
        if (userID == request.params.userid) {
            modelFuncs.getUserLoanTo(userID, (err, res) => {
                if (err) {
                    console.log(err)
                    response.status(500).send("Error occurred. - cannot get user Lending listings")
                } else {
                    response.status(200).send(res)
                }
            })
        } else {
            response.status(400).send("A user can only see their own Lending items.")
        }

    }

    return {
        ping,
        getAllUsers,
        getUser,
        createUser,
        signout,
        // editUser,
        // deleteUser,
        getAllListings,
        makeNewListing,
        getUserListings,
        getUserBorrowed,
        getListingInfo,
        login,
        validate,
        editListing,
        deleteListing,
        makeTransaction,
        searchListings,
        searchUsers,
        getUserLoanTo
    }

};