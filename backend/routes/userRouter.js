const express = require("express");
const{createUser, loginUser,forgetPassword,resetPassword,updateUser}= require("../controller/userController");
const auth =require("../middlewares/auth")
const app = require("../app/app.js");

const userRouter = express.Router();

//Register
userRouter.post("/register", createUser);
//Login
userRouter.post("/login", loginUser);
//ForgetPassword
userRouter.post("/forget-password", forgetPassword);
//UpdatePassword
userRouter.post("/reset-password", resetPassword);
//updateUser
userRouter.put("/update-User/:userId",auth.authentication2,updateUser);



module.exports = userRouter;