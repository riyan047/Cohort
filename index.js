const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "iamriyan";

const app = express();
app.use(cors())
app.use(express.json());

const users = [];

app.post('/signup', (req,res) => {

    const username = req.body.username;
    const password = req.body.password; 

    users.push({
        username,
        password,
    })

    res.send({
        message: "you have been signed up sucessfully"
    })

});


app.post('/signin', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password );

    if(user){
        let token = jwt.sign({
            username:username,
        }, JWT_SECRET);
        res.send({
            token
        })
        console.log(token);
    }else{
        res.status(403).send({
             message: "Invalid username or password"
        });
    }

});

app.get("/me", (req, res) => {
    const token = req.headers.authorization;
    const userDetails = jwt.verify(token, JWT_SECRET);

    const username = userDetails.username;

    const user = users.find(user => user.username === username);
    if (user) {
        res.send({
            username: user.username,
        })
    } else {
        res.status(401).send({
            message: "Unauthorized"
        })
    }
});

app.listen(3000);