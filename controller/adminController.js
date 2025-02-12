import adminSchema from "../model/adminSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userSchema from '../model/userSchema.js';
import { request, response } from "express";
import orderSchema from "../model/orderSchema.js";



dotenv.config();
var admin_secret_key = process.env.ADMIN_SECRET_KEY;

export const adminLoginController = async (request,response)=>{
  try{
    const adminObj =  await adminSchema.findOne({email:request.body.email});
    //  console.log("adminObj:",adminObj);
     const adminPassword = adminObj.password;
     const status = await bcrypt.compare(request.body.password,adminPassword);
      if(status){
              const expireTime = {expiresIn:'1d'};
              const token = jwt.sign({email:request.body.email},admin_secret_key,expireTime);
              // console.log("Token:",token);
          if(!token)
              response.render("AdminLogin",{message:"something went wrong"});
          response.cookie('admin_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
          response.render("adminHome",{email:request.body.email});
      }else{
          response.render("AdminLogin",{message:"email or password wrong"});
      }

  }catch(error){
      console.log("error in admin login ",error);
      response.render("AdminLogin",{message:"email or password wrong"});
  }
}
 export const adminUserListController = async(request,response)=>{
  try{
          const userList = await userSchema.find();
          response.render("adminUserList",{email:request.payload.email,userList:userList,message:""});
  }catch(error){
    console.log("Error at adminUserList Controller");
    response.render("adminHome",{email:request.payload.email});
    
  }
}
export const adminVerifyUserController = async(request,response)=>{
  try{
       const userEmail = request.query.userEmail;
       const updateStatus = {
        $set:{
          adminVerify:"Verified"
        }
       }
       const updateres = await userSchema.updateOne({email:userEmail},updateStatus);
       console.log("UpdateResult:",updateres);

       const userList = await userSchema.find();
       response.render("adminUserList",{email:request.payload.email,userList:userList,message:userEmail+"  verified succefully"});
    

  }catch(error){
    console.log("Error in adminVerifyUserController :",error);
    const userList = await userSchema.find();
    response.render("adminUserList",{email:request.payload.email,userList:userList,message:"Error while updating updating"});
    
  }
}
export const adminUserUpdateController =  async(request,response)=>{
  try{
      const userEmail = request.query.userEmail;
      console.log("user email ",userEmail);
      const userObj = await userSchema.findOne({email:userEmail});
      console.log("user obj ",userObj);
      response.render("userUpdationForm",{userObj:userObj});
  }catch(error){
      console.log("error in adminUserUpdateController ",error);
      response.render("PageNotFound");
  }
}

export const updateUser = async(request,response)=>{
  try {
      const {name,email,password,contact,diet,interests,address} = request.body;
      const formattedInterests = Array.isArray(interests) ? interests : [interests];
      var userObj = {
          name:name,
          email:email,
          password:password,
          contact:contact,
          diet:diet,
          formattedInterests: formattedInterests,
          address:address
      }
      var updateStatus = {
          $set:{
              name:name,
              email:email,
              password:password,
              contact:contact,
              diet:diet,
              formattedInterests: formattedInterests,
              address:address
          }
      }
      const result = await userSchema.updateOne({email:email},updateStatus);
      if(result.modifiedCount){
          const userList = await userSchema.find();
          response.render("adminUserList",{email:request.payload.email,userList:userList});
      }else{
          response.render("userUpdationForm",{userObj:userObj});
      }
  } catch (error) {
      console.log("error in updateuser ",error);
      response.render("PageNotFound");
  }
  
}
export const adminUserDeleteController = async(request,response)=>{
  const userEmail = request.query.userEmail;

  const result = await userSchema.deleteOne({email:userEmail});
  // console.log("result ",result);
  if(result.deletedCount){
      const userList = await userSchema.find();
      response.render("adminUserList",{email:request.payload.email,userList:userList});   
  }else{
      const userList = await userSchema.find();
      response.render("adminUserList",{email:request.payload.email,userList:userList});   
  }
}
export const adminLogoutController = async(request,response)=>{
  response.clearCookie('admin_jwt_token');
  response.render("AdminLogin",{message:"Admin Logout succefully"});
}
export const adminOrderManagementController = async(request,response)=>{
  try {
      const orders = await orderSchema.find();
      response.render("adminViewOrder",{orders,message:""});
      
  } catch (error) {
      response.render("PageNotFound");
      console.log("error in adminOrderManagementController ",error);
  }
}

export const adminUpdateOrderStatusController = async(request,response)=>{
  // console.log("request.body ",request.body);
  // response.status(200).send("code runned");
  try {
      const userId = request.body.userId;
      const status = request.body.status;
      const email = request.query.email;

  console.log(`email ${email}, status ${status}, userId ${userId}`);
      const updateStatus = {
          $set:{
              status
          }
      }
      
      const result = await orderSchema.updateOne({userId,email},updateStatus);
      console.log("result ",result);
      if(result.modifiedCount==1){
          const orders = await orderSchema.find();
          response.render("adminViewOrder",{orders,message:"updated Successfully"});
      }else{
          const orders = await orderSchema.find();
          response.render("adminViewOrder",{orders,message:"updated Successfully"});
      }
  } catch (error) {
      console.log("error in adminUpdateOrderStatusController ",error);
      response.render("PageNotFound");
  }
}