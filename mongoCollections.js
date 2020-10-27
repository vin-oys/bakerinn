const mongo = require('mongodb')
const uri = "mongodb://localhost:27017"


const myClient = new mongo.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

//connect to mongo client to perform operations
myClient.connect((err,db)=>{
    if(err){
        throw err
    }
    //create new database called bakerInn_db
    const newDB = myClient.db("bakerInn_db")

    //create new collections called users and listings
    newDB.createCollection("users")
        .then(res => newDB.createCollection("listings"))
        .then(res => newDB.createCollection("chats"))
        .then(res => newDB.createCollection("messages"))
        .then(res => {
            console.log("Successfully created database and collections.")
            db.close()})
        .catch(err => {console.log(err)})
})