import mongoose from "mongoose";
import url from "../database/connection.js";
mongoose.connect(url);
const AdminSchema = mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});
export default mongoose.model('adminSchema',AdminSchema,'admin');
