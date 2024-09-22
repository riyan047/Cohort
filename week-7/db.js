const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    email : {type:String, unique: true}, // to ensure do duplicate user 
    password: String,
    name: String
})

const Todo = new Schema({
    title : String,
    done : Boolean,
    userId : ObjectId
})

const UserModel = mongoose.model('users', User); //here users is the specific collection and User is schema

const TodoModel = mongoose.model('todos', Todo);

module.exports ={           //we are exporting this so that we can use it in index.js file
    UserModel: UserModel,
    TodoModel: TodoModel
}