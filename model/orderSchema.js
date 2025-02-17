import mongoose from "mongoose";
import url from "../database/connection.js";

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    tls:true
    // serverSelectionTimeoutMS:5000,
});

const orderSchema = mongoose.Schema({
    email:{
        type:String
    },
    userId:{
        type:String,
        // unique:true
    },
    name:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number,
        default:1
    },
    totalAmount:{
        type:Number,
        default:0
    },
    orderDate:{
        type:Date,
        default: new Date()
    },
    status:{
        type:String,
        default:"pending"
    }

})

export default mongoose.model('orderSchema',orderSchema,'order');