require("dotenv").config();
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = "mongodb://localhost:27017"
const bakerInnModelFunc = require('./models/bakerInn')

//mongodb is set up in ./server.js at the moment

// use process.env.DATABASE_URL or idkk...