
import express from 'express';
import { adminLoginController,adminLogoutController,adminUserListController,adminVerifyUserController ,adminUpdateOrderStatusController, adminUserUpdateController, updateUser, adminUserDeleteController,adminOrderManagementController} from '../controller/adminController.js';
import jwt from 'jsonwebtoken';
import dotenv, { config } from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();
const admin_secret_key =  process.env.ADMIN_SECRET_KEY;
var adminRouter = express.Router();
adminRouter.use(express.static('public'));
let authenticateJWT = (request,response,next)=>{
    const token = request.cookies.admin_jwt_token;
    // console.log("token:",token);
    
    try{
          
           jwt.verify(token,admin_secret_key,(error,payload)=>{
              if(error){
                response.render("adminLogin.ejs",{message:'Plz Login First'});
              }else{
                request.payload=payload;
                next();
              }
           });
    }catch(error){
        response.render("adminLogin.ejs",{message:'Something went wrong in jwt'});
    }
}

adminRouter.get("/",(request,response)=>{
    response.render("adminLogin.ejs",{message:''});
});

adminRouter.get("/adminHome",authenticateJWT,(request,response)=>{
    response.render("adminHome.ejs",{email:request.payload.email});
});

adminRouter.post("/adminLogin",adminLoginController);
adminRouter.get("/adminLogout",adminLogoutController);
adminRouter.get("/adminUserUpdate",adminUserUpdateController);
adminRouter.get("/adminUserList",authenticateJWT,adminUserListController);

adminRouter.get("/adminVerifyUser",authenticateJWT,adminVerifyUserController);

adminRouter.get("/orderManagement",adminOrderManagementController);

adminRouter.post("/updateStatus",authenticateJWT,adminUpdateOrderStatusController);
adminRouter.post("/updateUser",authenticateJWT,updateUser);

adminRouter.get("/adminUserDelete",authenticateJWT,adminUserDeleteController);
export default adminRouter;