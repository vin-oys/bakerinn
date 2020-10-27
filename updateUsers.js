const mongo = require("mongodb")
const uri = "mongodb://localhost:27017"

const myClient = new mongo.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

myClient.connect((err,db)=>{
  if(err){
      throw err
  }
  //create new database called bakerInn_db
  const bakerInn_db = db.db("bakerInn_db")
  //create new collections called users and listings
  bakerInn_db.collection("users").find().toArray()
      .then(res=>{
          let allUpdates = []
          res.forEach((user)=>{
              let newChats = []
              user.chats.forEach((chat)=>{
                  newChats.push({chat_id: chat, notifications: 0, updated_at: new Date()})
              })
              allUpdates.push(bakerInn_db.collection("users").updateOne({_id: user._id}, {$set: {chats: newChats}}))
          })
          return allUpdates
      })
      .then(res => {
          console.log("All user updates successful.")
      })
      .catch(err=>{console.log(err)})
})