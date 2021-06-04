const express = require('express');
const bodyParser = require('body-parser');
var app = new express()
const cors = require('cors');
var path = require('path');
app.use(cors());
var jwt = require('jsonwebtoken');
require('dotenv').config()
const register = require('./src/model/userdata.js')
app.use(bodyParser.json());
app.post('/register', function(req, res) {
    res.header('Access-Control-Allow-Origin', "*") // use of this that from any orgin u are getting the request of productapp then u they can acess
    res.header('Access-Control-Allow-Methds : GET , POST, PATCH , PUT ,DELETE ,OPTIONS');
    console.log(req.body);

    var data1 = {
        name: req.body.data.name,
        email: req.body.data.email,
        pass: register.hashPassword(req.body.data.pass),
        num: req.body.data.num
    }


    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            res.json({ abc: "already there" })
        } else {
            var data = new register(data1);
            data.save();
        }
    });


});
//login
app.post('/login', function(req, res, next) {
    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            if (doc.isValid(req.body.data.pass)) {
                let token = jwt.sign({ name: doc.name }, 'secret', { expiresIn: '1h' });
                return res.status(200).json(token)
            } else {
                let abc = "Invalid password"
                res.json(abc);
            }
        } else {
            let abc = "User not resgistered"
            res.json(abc);
        }
    });
})


app.get('/username', verifyToken, function(req, res, next) {
    return res.status(200).json(decodedToken.name);
})

var decodedToken = '';

function verifyToken(req, res, next) {
    let token = req.query.token;

    jwt.verify(token, 'secret', function(err, tokendata) {
        if (err) {
            return res.json({ message: ' Unauthorized request' });
        }
        if (tokendata) {
            decodedToken = tokendata;
            next();
        }
    })
}

app.listen(process.env.PORT || 2222)