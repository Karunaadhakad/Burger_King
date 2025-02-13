import mongoose from "mongoose";
import url from "../database/connection.js";

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    tls:true
    // serverSelectionTimeoutMS:5000,
});
const UserSchema = mongoose.Schema({

name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    Unique:true
},
password:{
    type: String,
    required:true
},
contact:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true
},
diet: {
    type: String,
    enum: ["Vegetarian", "Non-Vegetarian"],
    required: true
  },
  interests: {
    type: [String], // Store multiple values as an array
    enum: ['Pizza_Burger', "Korean_Burger", "Classic_Cheeseburger", "Chili_Burger"], // Allowed values
    required: true
  },
status:{
    type:String,
    default:true,  
    required:true
},
adminVerify:{
    type:String,
    default:"Not verify",
    required:true
},
emailVerify:{
    type:String,
    default:"Not verify",
    required:true
},
});
export default mongoose.model('userSchema',UserSchema,'user');

