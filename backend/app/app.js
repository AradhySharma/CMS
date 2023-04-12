const express = require("express");
const morgan = require("morgan");
const userRouter = require("../routes/userRouter.js");
const auth = require("../middlewares/auth.js")
const cors=require('cors')
const multer=require('multer')
const projectRouter = require("../routes/projectRouter.js");
const contentRouter = require("../routes/contentRouter.js");
const app = express();

//=======Middleware============
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())
app.use( multer().any())

//=======Routes======
//========User=======
app.use("/api/v1/users", userRouter);
//=======Project=====
app.use("/api/v1/projects", projectRouter);
//=======content=====
app.use("/api/v1/contents", contentRouter);

module.exports = app;