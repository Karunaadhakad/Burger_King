
import express, { request, response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userRegisterController,userVerifyEmailController,userLoginController,userLogoutController,userOrderDeleteController,userProfileUpdateController } from '../controller/userController.js';
import { addToCartController, deleteOrderController, placeOrderController, viewCartController } from '../controller/cartController.js';
import cartSchema from '../model/cartSchema.js';
import userSchema from '../model/userSchema.js';
import orderSchema from '../model/orderSchema.js';


dotenv.config();
const user_secret_key =  process.env.USER_SECRET_KEY;
var userRouter = express.Router();

userRouter.use(express.static('public'));
let authenticateJWT = (request,response,next)=>{
    const token = request.cookies.user_jwt_token;
    // console.log("token:",token);
    
    try{
          
           jwt.verify(token,user_secret_key,(error,payload)=>{
              if(error){
                response.render("UserLogin.ejs",{message:'Plz Login First'});
              }else{
                request.payload=payload;
                next();
              }
           });
    }catch(error){
        response.render("UserLogin.ejs",{message:'Something went wrong in jwt'});
    }
}
userRouter.get("/userHome",(request,response)=>{
    response.render("index.ejs");
});
userRouter.post("/updateProfile",userProfileUpdateController)
userRouter.get("/UserLogin",(request,response)=>{
    response.render("UserLogin.ejs",{message:''});
});
userRouter.get("/UserRegister",(request,response)=>{
    response.render("UserRegister.ejs",{message:''});
});
userRouter.post("/UserRegister",userRegisterController);
userRouter.get("/verifyEmail",userVerifyEmailController);
userRouter.post("/UserLogin",userLoginController);

userRouter.get("/UserHome",authenticateJWT,(request,response)=>{
    response.render("UserHome.ejs",{email:request.payload.email});
});
userRouter.get("/BrowseFood",authenticateJWT,async(request,response)=>{
    const cart = await cartSchema.find({email:request.payload.email});
    const cartCount = cart.length;
    response.render("BrowseFood.ejs",{email:request.payload.email,cartCount});
});
// userRouter.get("/UserProfile",(request,response)=>{
//     response.render("UserProfile.ejs");
// });
userRouter.get("/UserProfile",authenticateJWT,async(request,response)=>{
    try {
        const user = await userSchema.findOne({email : request.payload.email});
        response.render("UserProfile",{email:request.payload.email,user,message:""});
    } catch (error) {
        console.log("error in userProfile ",error)
    }
})
userRouter.post("/UserProfile",(request,response)=>{
    response.render("UserProfile.ejs");
});
userRouter.get("/UserLogout",userLogoutController);



// userRouter.post("/setNewPassword",setNewPassword);
userRouter.get("/cart",authenticateJWT,viewCartController);
userRouter.post("/cart/add",authenticateJWT,addToCartController);
userRouter.post("/cart/place",authenticateJWT,placeOrderController);
userRouter.get("/cart/delete",authenticateJWT,deleteOrderController);

userRouter.get("/order",authenticateJWT,async(request,response)=>{
    const orders = await orderSchema.find({email:request.payload.email});
    response.render("viewOrder",{email:request.payload.email,orders});
});

userRouter.get("/deleteOrder",authenticateJWT,userOrderDeleteController);
export default userRouter;