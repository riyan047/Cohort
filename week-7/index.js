const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const bcrypt = require("bcrypt");

const {UserModel, TodoModel} = require('./db') // importing the db file
const {auth, JWT_SECRET} = require('./auth') // importing the auth file

mongoose.connect("mongodb+srv://admin:IJtzhy95DLAu6Qpl@cluster0.jgy48.mongodb.net/todo-riyan-2");

const app = express();
app.use(express.json());


app.post('/signup',async (req,res) => {

    //input validation
    //step1 defining the schema 

    const requiredBody= z.object({
        email : z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100).regex(/[a-z]/).regex(/[A-Z]/),
        name: z.string().min(3).max(30)
    })
        //regex is used to set Validates that the password contains
        // at least one lowercase and one uppercase letter.
        
    const parsedDataWithSucess = requiredBody.safeParse(req.body);

    if(!parsedDataWithSucess.success){
        res.json({
            mssg: "Incorrect format",
            error: parsedDataWithSucess.error  // shows the error to user indicating error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const hashedPassword = await bcrypt.hash(password,5);
    
    await UserModel.create({
       email: email,
       password: hashedPassword,
       name: name
    })

    res.json({
        message: "you are signed up"
    })
});


app.post('/login',async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({
        email: email,
    })
    
    if(!response){
        res.json({
            mssg: "User does not exist in the DB"
        })
        return
    }

    const passwordMatch= await bcrypt.compare (password, response.password);


    if (passwordMatch){
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET)
        res.send({
            token
        })

    } else{
        res.status(403).send({
            mssg: "Incorrect Credentials",
        })
    }
});



app.post('/todo',auth, async (req,res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;


    await TodoModel.create({
        title,
        done,
        userId
    })

    res.send({
        message: "todo created and the task is " + title
    });
});

app.get('/todos', auth, async (req,res) => {
    const userId = req.userId;

  
    const todos = await TodoModel.find({  // here is we use findOne it will show the lastest todo
        userId                            //find shows all the todos repective to the user
        
    })

    res.json({
        todos
    })
});


app.listen(3000);