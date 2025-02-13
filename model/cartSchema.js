import mongoose from "mongoose";
import url from "../database/connection.js";

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverSelectionTimeoutMS:5000,
});

const cartSchema = mongoose.Schema({
    email:{
        type:String
    },
    userId:{
        type:String
    },
    cartCount:{
        type:Number,
        default:0
    },
    items: [{ name: String, price: Number, quantity: Number }],
})

export default mongoose.model('cartSchema',cartSchema,'cart');