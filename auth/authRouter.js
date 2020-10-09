const express = require("express");
const Users = require("./authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const restricted = require("./restricted-middleware");

const router = express.Router();

//register
router.post("/register", (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hash;

    Users.add(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            next({apiCode: 500, apiMessage: "error registering", ...err});
        })
});

//login
router.post("/login", (req, res, next) => {
    let {username, password} = req.body;

    Users.findBy(username)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){

                const token = generateToken(user);
                
                res.status(200).json({
                    message: "Logged in!",
                    token: token
                });
            }
        })
        .catch(err => {
            next({apiCode: 500, apiMessage: "error logging in", ...err});
        })
});

//get users
router.get("/users", restricted, (req, res, next) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            next({apiCode: 500, apiMessage: "error logging in", ...err});
        })
});

function generateToken(user){
    payload = {
        subject: user.id,
        username: user.username,
        role: user.role
    };

    const secret = "I'm the best around";

    options = {
        expiresIn: "1d"
    };

    const token = jwt.sign(payload, secret, options)

    return token;
}

module.exports = router;