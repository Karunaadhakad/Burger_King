import bcrypt from 'bcrypt';
import mailer from '../router/mailer.js';
import userSchema from '../model/userSchema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import orderSchema from '../model/orderSchema.js';

dotenv.config();
var user_secret_key = process.env.USER_SECRET_KEY;
export const userVerifyEmailController =async(request,response)=>{
    try{
            var email = request.query.email;
            var updateStatus = {
               $set : {
                emailVerify : "Verified"
               }
            };
            var result = await userSchema.updateOne({email:email},updateStatus);
            response.render("UserLogin",{message:"Email verified | Admin verification takes 24hours"});
       
    }
    catch(error){
      console.log("Error",error);
      response.render("UserLogin",{message:"Something went wrong"});
      
    }
  };
  // export const userLoginController =async(request,response)=>{
  //   try{
  //          const{email,password}=request.body;
  //          console.log("login data"+password);
  //       const userObj = await userSchema.findOne({email:email});
  //       const userPassword = userObj.password;
  //       console.log("login data"+userPassword);
           
  //   }catch(error){
  //       console.log("Error:",error);
  //       response.render("UserLogin",{message:"Something went wrong"});
  //   }
  // }

  export const userLoginController = async(request,response)=>{
  try{
       
       const userObj =  await userSchema.findOne({email:request.body.email});
       const userPassword = userObj.password;
       const userStatus = userObj.status;
       const adminVerifyStatus= userObj.adminVerify;
       const emailVerifyStatus = userObj.emailVerify;

       const status = await bcrypt.compare(request.body.password,userPassword);
      
    //    if(status && userStatus && adminVerifyStatus=="Verified" && emailVerifyStatus=="Verified"){
        if(status && userStatus  && emailVerifyStatus=="Verified"){
        const expireTime = {expiresIn:'1d'};
        const token = jwt.sign({email:request.body.email},user_secret_key,expireTime);
        // console.log("Token:",token);
        
        if(!token)
           response.render("UserLogin",{message:"Error white setting up the token while user login controller"});
           response.cookie('user_jwt_token',token,{maxAge:24*60*60*1000,httpOnly:true});
           response.render("UserHome",{email:request.body.email});
        }
        else{
          response.render("UserLogin",{message:'EmailId or Password is wrong'});
        }
  }catch(error){
      console.log("Error in UserLogin",error);
      response.render("UserLogin",{message:'Something Went wrong'});
  }
  }

export const userRegisterController = async(request,response)=>{
    // const {name,email,password,contact,address,diet,interests} = request.body;
    try{
        const {name,email,password,contact,address,diet,interests} = request.body;
        const formattedInterests = Array.isArray(interests) ? interests : [interests];
           const obj = {
            name:name,
            email:email,
            password:await bcrypt.hash(password,10),
            contact:contact,
            address:address,
            diet:diet,
            interests:formattedInterests
           }
           const mailcontent  = `Hello ${email}, <br> This is a verification mail by Burger King (Fast food) system.You needs to verify yourself by clicking on the below link.<br><a href='http://localhost:3000/user/verifyEmail?email=${email}'>Click Here To Verify</a>`;

           mailer.mailer(mailcontent,email,async(info)=>{
                 if(info){
                            const result = await userSchema.create(obj);
                            console.log("Result Of User Registration:",result);
                            response.render("UserLogin",{message:"Email Sent | Plz Verify"});
                 }else{
                    console.log("Error while sending email");
                    response.render("UserRegister",{message:"Error while sending email"});
                    
                 } 
           });
    }
    catch(error){
        console.log("Error occured in recruiter Registration",error);
        response.render("UserRegister",{message:"Error while sending email"});
        
    }
}
export const userProfileUpdateController = async(request,response)=>{
  try {
      console.log("request.body ",request.body);
      const {name,email,contact} = request.body;
      console.log("email ",email)
      const updateStatus = {
          $set:{
              name,
              contact
          }
      }
      
      const result = await userSchema.updateOne({email:email},updateStatus);
      console.log("result ",result);
      if(result.modifiedCount){
          const user = await userSchema.findOne({email});
          response.render("UserProfile",{email,user,message:"Profile updated successfully"});
      }
      else{
          const user = await userSchema.findOne({email});
          response.render("UserProfile",{email,user,message:"error while updating Profile"});
      }    
  } catch (error) {
      console.log("error in userProfileUpdateController ",error);
      const user = await userSchema.findOne({email : request.body.email});
      response.render("UserProfile",{email:request.body.email,user,message:""});
  }
}

export const userLogoutController = async(request,response)=>{
  response.clearCookie('user_jwt_token');
  response.render("UserLogin",{message:"user Logout succefully"});
}
export const userOrderDeleteController = async(request,response)=>{
  try {
      const userId = request.query.userId;
      // console.log("userId ",userId);
      const email = request.payload.email;
      // console.log("email ",email);
      const result = await orderSchema.deleteOne({email,userId});
      // console.log("result ",result);
      if(result.deletedCount==1){
          const orders = await orderSchema.find({email});
          response.render("viewOrder",{email,orders});
      }
      else{
          response.render("PageNotFound");
      } 
  } catch (error) {
      console.log("error in userOrderDeleteController ",error);
      response.render("PageNotFound");
  }
}