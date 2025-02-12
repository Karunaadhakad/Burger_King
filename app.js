
import express from 'express';
import adminRouter from './router/adminRouter.js';
import userRouter from './router/userRouter.js';
import cookieParser from 'cookie-parser';



var app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser());
app.set("views","views");
app.set("view engine","ejs");

app.get("/",(request,response)=>{
    response.render("index");
});
app.use("/admin",adminRouter);
app.use("/user",userRouter);

app.listen(3000,()=>{
    console.log("Server connection established");  
});
