// authorization middleware
require("dotenv").config();

const jwt = require('jsonwebtoken');
const secret = process.env.SECRET

const withAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).send("NO TOKEN PROVIDED")
        console.log("NO TOKEN PROVIDED")
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(403).send("INVALID TOKEN!")
                console.log("invalid token")
            } else {
                // return the decoded info
                req.userId = decoded.userId
                req.email = decoded.email
                req.username = decoded.username

                next()
            }
        })
    }
}

module.exports = withAuth