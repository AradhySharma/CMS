const jwt = require('jsonwebtoken');
const mongoose = require ("mongoose");
const userModel = require('../model/userModel');

const {isValidObjectId} = mongoose;

exports.authentication2 = async function(req, res, next){
        // Get the token from the request header
        const token = req.header('x-api-key');
        console.log(token)
        console.log("lucky")

        // If token not provided, return error
        if (!token) {
            return res.status(401).send({ status: false, msg: 'Unauthorized' });
        }

        // Verify the token
        const decoded = jwt.verify(token, "Secretkey"); // Replace with your own JWT secret

        // Find user by ID from the decoded token
        const user = await userModel.findById(decoded.userId);

        // If user not found, return error
        if (!user) {
            return res.status(401).send({ status: false, msg: 'Unauthorized' });
        }

        // Attach the user object to the request for further use
        req.user = user;
        next(); // Call the next middleware
}




















































































// exports.authentication = async function(req, res, next){
//     // try{
//     let token = req.headers["x-api-key"];
//     if(!token){
//         return res.status(400).send({status:false,message:"token must be present"})
//     }
//     let decodedToken = jwt.verify(token, "Secretkey");
//     if (!decodedToken)
//         return res.status(400).send({ status: false, msg: "Token Not Verified Please Enter Valid Token" })
//     req.decodedToken = decodedToken;
//     next();
//     // }catch(error){
//     //     return res.status(500).send({status:false, msg: error.message});
//     // }
// }

// exports.authorisation = async function(req, res, next){
//     // try{
//         let authorLoggedIn = req.decodedToken.userId;
//         const userId = req.params.userId;
//         if(!isValidObjectId(userId)){
//             return res.status(400).send({status:false,message:"invalid userid"});
//         }
//         let checkUserId = await userModel.findById(userId)
//         if (!checkUserId)
//             return res.status(404).send({ status: false, message: "User not Found" })
//         if (checkUserId._id != authorLoggedIn)
//             return res.status(403).send({ status: false, msg: "loggedin user not allowed to modify changes" });
//         req.user = checkUserId
//         next()

//     // }catch(error){
//     //     return res.status(500).send({status:false, msg:error.message})
//     // }
// }

