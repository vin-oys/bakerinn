const withAuth = require("./authorization.js")
require("dotenv").config();
const path = require('path')

module.exports = (app, db) => {

  const bakerIn = require('./controllers/bakerInn')(db);
  const bakerInChats = require('./controllers/bakerInnChats')(db);

  // ping to see if the server is running
  app.get('/api/ping', bakerIn.ping)

  // used middleware to check authorization
  app.get('/api', withAuth, bakerIn.validate);


  //user CRUD operations
  app.get('/api/users', bakerIn.getAllUsers)

  app.post('/api/users/new', bakerIn.createUser)

  app.post('/api/users/login', bakerIn.login)

  app.get('/api/users/:id', withAuth, bakerIn.getUser)
  // app.put('/api/users/:id/edit', withAuth, bakerIn.editUser)
  // app.delete('/api/users/:id/delete', withAuth, bakerIn.deleteUser)

  app.get('/api/signout', bakerIn.signout)

  //listings CRUD operations
  app.get('/api/listings', bakerIn.getAllListings)

  //create new listing
  app.post('/api/listings/new', withAuth, bakerIn.makeNewListing)

  //get all of a user's posted listings
  app.get('/api/listings/user/:userid', bakerIn.getUserListings)

  //get all of a user's borrowed from listings
  app.get('/api/listings/user/:userid/borrowed', withAuth, bakerIn.getUserBorrowed)

  //get specific listing info
  app.get('/api/listings/:id', bakerIn.getListingInfo)

  // //update listing's 'interested' list
  // app.put('/api/listings/:id/interested', withAuth, bakerIn.expressInterest)

  //update listing to unavailable
  app.put('/api/listings/:id/update-state', withAuth, bakerIn.makeTransaction)

  //make changes to specific listing
  app.put('/api/listings/:id/edit', bakerIn.editListing)

  //delete specific listing
  app.delete('/api/listings/:id/delete', bakerIn.deleteListing)

  //when user expresses interest, create chat
  app.post('/api/chats/new', withAuth, bakerInChats.createChat)

  //get one chat from owner/listing/buyer id - called once when buyer wants to access a chat
  app.get('/api/chats/find/:ownerid/:listingid', withAuth, bakerInChats.getChatIdByInfo)

  //get chat from buyer/listing/owner id - called multiple times when owner wants to see chats for a given listing.
  app.get('/api/chats/find/buyers/:buyerid/:listingid', withAuth, bakerInChats.getChatIdsByInfo)

  //to get basic information on existing chat
  app.get('/api/chats/:id', bakerInChats.getChat)

  //post a new message to message collection
  app.post('/api/chats/:id/new-message', bakerInChats.postMessage)

  //post a message to a chat
  app.get('/api/chats/:id/messages', bakerInChats.getMessages)

  //search listings, search users
  app.get('/api/search/listings', bakerIn.searchListings)
  app.get('/api/search/users', bakerIn.searchUsers)

  //get all of a user's loan to listings
  app.get('/api/listings/user/:userid/loan', withAuth, bakerIn.getUserLoanTo)

  app.put('/api/chats/:chatid/:receiverid/update-notifications', bakerInChats.updateNotifications)


  if(process.env.NODE_ENV==="production"){
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    })
  }

};