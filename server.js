const routes = require('./routes')
const mongo = require('mongodb')
const modelFuncs = require('./models/bakerInn')
const modelChatFuncs = require('./models/bakerInnChats')
const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const cookieParser = require("cookie-parser")

require("dotenv").config();


// middleware
app.use(express.json())
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))
}

app.use(methodOverride('_method'));
app.use(cookieParser());


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const uri = process.env.MONGODB_URI
const myClient = new mongo.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

//connect to mongo client to perform operations
myClient.connect((err, db) => {
  if (err) {
    throw err
  }
  //link up to bakerInn_db
  let bakerInnDB = db.db("bakerInn_db")
  let modelFuncsObj = modelFuncs(bakerInnDB)
  let modelChatFuncsObj = modelChatFuncs(bakerInnDB)

  // set up routes
  routes(app, { modelFuncsObj, modelChatFuncsObj })

})

//initialize io to receive connections
const server = require('http').createServer(app);
const io = require('socket.io')(server);


//connect socket io
//handshake from client App.js to see who is user is
//to improve security we could check token here to verify socket connection
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(socket.handshake.query.username , 'connected');
  }

  //socket joins a room
  socket.on('join', ({room_id})=>{
    socket.join(room_id)
  })

  socket.on('leave', ({room_id})=>{
    socket.leave(room_id)
  })

  //on sendMessage event from client, message gets emitted to the room
  socket.on('sendMessage', ({ message, sender_name, chat_id, user_id, sender_id })=>{

    //send the message to the room
    io.to(chat_id).emit('receiveMessage' + chat_id , { message, sender_name, sender_id } )

    //send notification to message recipient
    socket.to(user_id).emit('receiveNotification'+user_id, { chat_id, isSender: false })

    //send signal to message sender to push chat to the top.
    io.to(sender_id).emit('receiveNotification'+sender_id, { chat_id, isSender: true })

  })

  //notification of transferring ownership ONLY FOR SALE ITEMS
  socket.on('transferOwnership', ({chat_id})=>{
    io.to(chat_id).emit('receiveOwnership'+chat_id)
  })

  //sending loan confirmation from buyer to seller and vice versa FOR LOAN ITEMS
  socket.on('sendLoanConfirmation', ({chat_id}) => {
    socket.to(chat_id).emit('receiveLoanConfirmation'+chat_id)
  })

  socket.on('sendReturnConfirmation', ({chat_id}) => {
    socket.to(chat_id).emit('receiveReturnConfirmation'+chat_id)
  })

  socket.on('loanFinalised', ({chat_id}) => {
    io.to(chat_id).emit('receiveLoanFinalised'+chat_id)
  })

  socket.on('returnFinalised', ({chat_id}) => {
    io.to(chat_id).emit('receiveReturnFinalised'+chat_id)
  })




  socket.on('disconnect', () => {
    console.log(socket.handshake.query.username, 'disconnected');
  })

  // function noOfClientsInRoom(room){
  //   let clients = io.nsps['/'].adapter.rooms[room].sockets
  //   return Object.keys(clients).length
  // }

});

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
})


//close db connection when app is closed.
let onClose = function () {
  server.close(() => {
    console.log('Process terminated')
    myClient.close(() => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);