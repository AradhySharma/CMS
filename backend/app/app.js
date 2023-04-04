const express = require("express");
const morgan = require("morgan");
const Router = require("../routes/routes.js");
const app = express();

//=======Middleware============
app.use(morgan("dev"));


//=======Routes======

app.use("/me", (req,res) => {
    res.json({
        msg: "aradhy sharma"
    }

    )

})


module.exports = app;