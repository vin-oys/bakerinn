const mongo = require('mongodb')
const ObjectId = mongo.ObjectId
const uri = "mongodb://localhost:27017"


const myClient = new mongo.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

//dummy listing data
let dummyListings = [{ "_id" : ObjectId("5f68579c4031f515d40ff91b"), "item" : "cake tin", "description" : "6 inch diameter", "price" : "5", "category" : "equipment", "option" : "loan", "location" : "east", "owner_id" : "5f6857424031f515d40ff918", "state" : "available", "interested" : [ "5f6857504031f515d40ff919", "5f68576a4031f515d40ff91a" ], "buyer_id" : null }, { "_id" : ObjectId("5f6857b44031f515d40ff91c"), "item" : "dutch oven", "description" : "clean, barely used", "price" : "12", "category" : "equipment", "option" : "sale", "location" : "south", "owner_id" : "5f6857424031f515d40ff918", "state" : "unavailable", "interested" : [ "5f6857504031f515d40ff919", "5f68576a4031f515d40ff91a" ], "buyer_id" : "5f68576a4031f515d40ff91a" }, { "_id" : ObjectId("5f6857cc4031f515d40ff91d"), "item" : "flour", "description" : "500g", "price" : "0", "category" : "ingredient", "option" : "sale", "location" : "south", "owner_id" : "5f6857424031f515d40ff918", "state" : "unavailable", "interested" : [ "5f6857354031f515d40ff917", "5f6857504031f515d40ff919", "5f68576a4031f515d40ff91a" ], "buyer_id" : "5f68576a4031f515d40ff91a" }, { "_id" : ObjectId("5f686c3a3238f819ee3b413d"), "item" : "baking powder", "description" : "400g", "price" : "1", "category" : "ingredient", "option" : "sale", "location" : "south", "owner_id" : "5f6857424031f515d40ff918", "state" : "unavailable", "interested" : [ "5f6857354031f515d40ff917" ], "buyer_id" : "5f6857354031f515d40ff917" },{ "_id" : ObjectId("5f686d803238f819ee3b4142"), "item" : "Croissants", "description" : "I made too many! Please take some!!", "price" : "0", "category" : "ingredient", "option" : "sale", "location" : "south", "owner_id" : "5f6857424031f515d40ff918", "state" : "unavailable", "interested" : [ "5f6857504031f515d40ff919" ], "buyer_id" : "5f6857504031f515d40ff919" }, { "_id" : ObjectId("5f686ddf3238f819ee3b4146"), "item" : "Cream cheese", "description" : "I have way too much!", "price" : "2", "category" : "ingredient", "option" : "sale", "location" : "west", "owner_id" : "5f6857504031f515d40ff919", "state" : "unavailable", "interested" : [ "5f6857424031f515d40ff918" ], "buyer_id" : "5f6857424031f515d40ff918" }]

//dummy user data
let dummyUsers = [{ "_id" : ObjectId("5f6857354031f515d40ff917"), "email" : "ali@wong", "username" : "aliwong", "password" : "$2b$10$wDpsOlN69ccvcKJqPX0vhONhXhHgTgAqdTseEVpBJYM6i/ApSDqUi", "chats" : [ ObjectId("5f685f0d2ebd05186c8a5539"), ObjectId("5f686c493238f819ee3b413e") ], "bought" : [ "5f686c3a3238f819ee3b413d" ] }, { "_id" : ObjectId("5f6857424031f515d40ff918"), "email" : "seinfeld@hello", "username" : "seinfeld", "password" : "$2b$10$H.vXgkfrslTECf4FtnIO4.qIkW1ve8bccumbYFoXC5TebUT0aDHRK", "listings" : [ ObjectId("5f68579c4031f515d40ff91b"), ObjectId("5f6857b44031f515d40ff91c"), ObjectId("5f6857cc4031f515d40ff91d"), ObjectId("5f686c3a3238f819ee3b413d"), ObjectId("5f686d803238f819ee3b4142") ], "chats" : [ ObjectId("5f685f0d2ebd05186c8a5539"), ObjectId("5f686174356ca4187f402512"), ObjectId("5f6863b89d4bf2196d90b84d"), ObjectId("5f68642e9d4bf2196d90b84e"), ObjectId("5f6864b54b5f6a19ac5d473d"), ObjectId("5f6864fa4b5f6a19ac5d473e"), ObjectId("5f6866323238f819ee3b4135"), ObjectId("5f686c493238f819ee3b413e"), ObjectId("5f686d883238f819ee3b4143"), ObjectId("5f686f983238f819ee3b4147") ], "bought" : [ "5f686ddf3238f819ee3b4146" ] }, { "_id" : ObjectId("5f6857504031f515d40ff919"), "email" : "mulaney@goodbye", "username" : "mulaney", "password" : "$2b$10$iURqQMAnMOu9ocTeDbEAoeUaM1AO6k7KlxhWPslF6m1Onx.KdPYTW", "chats" : [ ObjectId("5f686174356ca4187f402512"), ObjectId("5f6863b89d4bf2196d90b84d"), ObjectId("5f68642e9d4bf2196d90b84e"), ObjectId("5f686d883238f819ee3b4143"), ObjectId("5f686f983238f819ee3b4147") ], "bought" : [ "5f686d803238f819ee3b4142" ], "listings" : [ ObjectId("5f686ddf3238f819ee3b4146") ] }, { "_id" : ObjectId("5f68576a4031f515d40ff91a"), "email" : "ronnie@chieng", "username" : "ronnie", "password" : "$2b$10$EXXLycX1uaISQr.9tmAS6epGsUB2nu4aFSN9WGMeDWzuG0TamjUrK", "chats" : [ ObjectId("5f6864b54b5f6a19ac5d473d"), ObjectId("5f6864fa4b5f6a19ac5d473e"), ObjectId("5f6866323238f819ee3b4135") ], "borrowed" : [ ], "bought" : [ "5f6857cc4031f515d40ff91d", "5f6857b44031f515d40ff91c" ] }]

let dummyChats = [{ "_id" : ObjectId("5f685f0d2ebd05186c8a5539"), "listing_id" : "5f6857cc4031f515d40ff91d", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f6857354031f515d40ff917" }, { "_id" : ObjectId("5f686174356ca4187f402512"), "listing_id" : "5f6857b44031f515d40ff91c", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f6857504031f515d40ff919" }, { "_id" : ObjectId("5f6863b89d4bf2196d90b84d"), "listing_id" : "5f68579c4031f515d40ff91b", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f6857504031f515d40ff919" }, { "_id" : ObjectId("5f68642e9d4bf2196d90b84e"), "listing_id" : "5f6857cc4031f515d40ff91d", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f6857504031f515d40ff919" }, { "_id" : ObjectId("5f6864b54b5f6a19ac5d473d"), "listing_id" : "5f6857b44031f515d40ff91c", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f68576a4031f515d40ff91a" }, { "_id" : ObjectId("5f6864fa4b5f6a19ac5d473e"), "listing_id" : "5f6857cc4031f515d40ff91d", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f68576a4031f515d40ff91a" }, { "_id" : ObjectId("5f6866323238f819ee3b4135"), "listing_id" : "5f68579c4031f515d40ff91b", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f68576a4031f515d40ff91a" }, { "_id" : ObjectId("5f686c493238f819ee3b413e"), "listing_id" : "5f686c3a3238f819ee3b413d", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f6857354031f515d40ff917" }, { "_id" : ObjectId("5f686d883238f819ee3b4143"), "listing_id" : "5f686d803238f819ee3b4142", "owner_id" : "5f6857424031f515d40ff918", "buyer_id" : "5f6857504031f515d40ff919" }, { "_id" : ObjectId("5f686f983238f819ee3b4147"), "listing_id" : "5f686ddf3238f819ee3b4146", "owner_id" : "5f6857504031f515d40ff919", "buyer_id" : "5f6857424031f515d40ff918" }]

let dummyMessages = [ { "_id" : ObjectId("5f6866063238f819ee3b4133"), "message" : "hi there!", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f6864b54b5f6a19ac5d473d" }, { "_id" : ObjectId("5f6866183238f819ee3b4134"), "message" : "hey, can I have this?", "user_id" : "5f68576a4031f515d40ff91a", "chat_id" : "5f6864b54b5f6a19ac5d473d" }, { "_id" : ObjectId("5f6866443238f819ee3b4136"), "message" : "Hi! Let's do the handover now", "user_id" : "5f68576a4031f515d40ff91a", "chat_id" : "5f6866323238f819ee3b4135" }, { "_id" : ObjectId("5f68664c3238f819ee3b4137"), "message" : "Sure, no problem", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f6866323238f819ee3b4135" }, { "_id" : ObjectId("5f6867ee3238f819ee3b4138"), "message" : "Hi, how much is this?", "user_id" : "5f68576a4031f515d40ff91a", "chat_id" : "5f6864fa4b5f6a19ac5d473e" }, { "_id" : ObjectId("5f6867f73238f819ee3b4139"), "message" : "I'll give it to you for free, when can you collect", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f6864fa4b5f6a19ac5d473e" }, { "_id" : ObjectId("5f6868083238f819ee3b413a"), "message" : "how's thursday?", "user_id" : "5f68576a4031f515d40ff91a", "chat_id" : "5f6864fa4b5f6a19ac5d473e" }, { "_id" : ObjectId("5f6868133238f819ee3b413b"), "message" : "sounds good.", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f6864fa4b5f6a19ac5d473e" }, { "_id" : ObjectId("5f686a053238f819ee3b413c"), "message" : "sure, no problem.", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f6864b54b5f6a19ac5d473d" }, { "_id" : ObjectId("5f686c503238f819ee3b413f"), "message" : "Hi there! Can I have this?", "user_id" : "5f6857354031f515d40ff917", "chat_id" : "5f686c493238f819ee3b413e" }, { "_id" : ObjectId("5f686c633238f819ee3b4140"), "message" : "sure, actually 2 dollars would be better", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f686c493238f819ee3b413e" }, { "_id" : ObjectId("5f686c683238f819ee3b4141"), "message" : "no problem.", "user_id" : "5f6857354031f515d40ff917", "chat_id" : "5f686c493238f819ee3b413e" }, { "_id" : ObjectId("5f686d903238f819ee3b4144"), "message" : "Hi!!! I'd really like these!!!", "user_id" : "5f6857504031f515d40ff919", "chat_id" : "5f686d883238f819ee3b4143" }, { "_id" : ObjectId("5f686da43238f819ee3b4145"), "message" : "Yes please have them!", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f686d883238f819ee3b4143" }, { "_id" : ObjectId("5f686fa03238f819ee3b4148"), "message" : "Hi, I'd love some! 200g?", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f686f983238f819ee3b4147" }, { "_id" : ObjectId("5f686fb13238f819ee3b4149"), "message" : "Sounds good! Are you sure you don't want more?", "user_id" : "5f6857504031f515d40ff919", "chat_id" : "5f686f983238f819ee3b4147" }, { "_id" : ObjectId("5f686fb83238f819ee3b414a"), "message" : "haha ok, 400g", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f686f983238f819ee3b4147" }, { "_id" : ObjectId("5f6870303238f819ee3b414b"), "message" : "hey, can I borrow this once it's available?", "user_id" : "5f6857504031f515d40ff919", "chat_id" : "5f6863b89d4bf2196d90b84d" }, { "_id" : ObjectId("5f68703e3238f819ee3b414c"), "message" : "sure!", "user_id" : "5f6857424031f515d40ff918", "chat_id" : "5f6863b89d4bf2196d90b84d" }, { "_id" : ObjectId("5f68707d3238f819ee3b414d"), "message" : "When can I return this", "user_id" : "5f68576a4031f515d40ff91a", "chat_id" : "5f6866323238f819ee3b4135" } ]

//connect to mongo client to perform operations
myClient.connect((err,db)=>{
    if(err){
        throw err
    }
    //refer to bakerInn db
    const bakerInnDB = db.db("bakerInn_db")

    let seedingPromises = []

    //fill users with dummy data
    seedingPromises.push(
        bakerInnDB.collection("users").insertMany(dummyUsers)
            .then(res => res)
            .catch(err => {throw err})
        )


    //fill listings with dummy data
    seedingPromises.push(
        bakerInnDB.collection("listings").insertMany(dummyListings)
            .then(res => res)
            .catch(err => {throw err})
        )

    //fill listings with dummy data
    seedingPromises.push(
        bakerInnDB.collection("chats").insertMany(dummyChats)
            .then(res => res)
            .catch(err => {throw err})
        )

    //fill listings with dummy data
    seedingPromises.push(
        bakerInnDB.collection("messages").insertMany(dummyMessages)
            .then(res => res)
            .catch(err => {throw err})
        )

    //when both users and listings seeded, return message.
    Promise.all(seedingPromises)
        .then(res => {
            db.close()
            console.log("Tables successfully seeded.")})
        .catch(err => {console.log(err)})
})