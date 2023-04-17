const userModel = require("../model/userModel");
const mongoose = require ("mongoose");
const {isValidObjectId} = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.createUser = async function (req, res){
    try{
        let data = req.body;
        if(Object.keys(data).length == 0){
            return res.status(400).send({status:"false", message:"All fields are mandatory "});
        }

        let {name,email,password,company,secretQuestion} = data;

        if(!name){
            return res.status(400).send({status:"false", message:"name is mandatory "});
        }
        if(!email){
            return res.status(400).send({status:"false", message:"email is mandatory "});
        }
        if(!password){
            return res.status(400).send({status:"false", message:"password is mandatory "});
        }
        if(!company){
            return res.status(400).send({status:"false", message:"company is mandatory "});
        }
        if(!secretQuestion){
            return res.status(400).send({status:"false", message:"secretQuestion is mandatory "});
        }
        if(!secretQuestion.question){
            return res.status(400).send({status:"false", message:"question is mandatory "});
        }
        if(!secretQuestion.answer){
            return res.status(400).send({status:"false", message:"answer is mandatory "});
        }
                // Email validation using regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(email)){
                    return res.status(400).send({status: false, message: "Invalid email address."});
                }
        
                // Password validation using regex
                const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if(!passwordRegex.test(password)){
                    return res.status(400).send({status: false, message: "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."});
                }
        let hash = await bcrypt.hash(password, 10);
        data.password = hash;

        let cheakEmail = await userModel.findOne({email});
        if(cheakEmail){
            return res.status(400).send({status:"false", message:"Email already in use"})
        }
        const userData = await userModel.create(data)
        return res.status(201).send({status:"true", message:"User has been created sucssesfuly"})

    }catch(error){
        return res.status(500).send({status:false, msg:error.message})
    }
};

exports.loginUser = async function(req,res){
    try{
    let data = req.body;
    let {email, password} = data;
    if(Object.keys(data).length == 0){
        return res.status(400).send({status:"false", message:"All fields are mandatory "});
    }
    if(!email){
        return res.status(400).send({status:false, message:"please enter email"})
    }
    if(!password){
        return res.status(400).send({status:false, message:"please enter password"})
    }
    let user = await userModel.findOne({email});
    if(!user){
        return res.status(404).send({status:false,message:"user not found"})
    }
    let cheakPassword = await bcrypt.compare(password, user.password);
    if(!cheakPassword){
        return res.status(401).send({status:false, message:"incorrect password"});
    }
    let token = jwt.sign({userId:user._id.toString()},"Secretkey")

    // res.setHeader("x-api-key", token);
    return res.status(200).send({status:true, message:"logged in successfuly", "x-api-key": token});
}catch(error){
    return res.status(500).send({status:false, msg:error.message});
}
}

exports.forgetPassword = async function(req,res){
    try{
    let data = req.body;
    if(!data.email){
        return res.status(400).send({status:false, msg:"email is mandatory"})
    }
    let findUser= await userModel.findOne({email:data.email})
    if(!findUser){
        return res.status(400).send({status:false, msg:"user not found"})
    }
    data.question = findUser.secretQuestion.question
    return res.status(200).send({status:true, data:data})
    }catch(error){
        return res.status(500).send({status:false, msg:error.message});
    }
}

exports.resetPassword = async function (req,res){
    try{
        let data = req.body;

        if(Object.keys(data).length == 0){
            return res.status(400).send({status:"false", message:"All fields are mandatory "});
        }

        let { email, secretQuestion, secretAnswer, newPassword } = data;

        if (!email) {
            return res.status(400).send({ status: false, msg: "email are mandatory" });
        }
        if (!secretQuestion) {
            return res.status(400).send({ status: false, msg: "secretQuestion are mandatory" });
        }
        if (!secretAnswer) {
            return res.status(400).send({ status: false, msg: "secretAnswer are mandatory" });
        }
        if (!newPassword) {
            return res.status(400).send({ status: false, msg: "secretAnswer are mandatory" });
        }
        // Password validation using regex
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(newPassword)){
            return res.status(400).send({status: false, message: "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."});
        }

        // Find user by email
        const user = await userModel.findOne({email});

        // If user not found, return error
        if (!user) {
            return res.status(400).send({ status: false, msg: "User not found" });
        }

        // Verify secret question and answer
        if (user.secretQuestion.question !== secretQuestion || user.secretQuestion.answer !== secretAnswer) {
            return res.status(401).send({ status: false, msg: "Invalid secret question or answer" });
        }
        let hash = await bcrypt.hash(newPassword, 10);
        newPassword = hash;



        // Update user password
        user.password = newPassword;
        await user.save();

        return res.status(200).send({ status: true, msg: "Password reset successfully"});
}catch(error){
    return res.status(500).send({status:false, msg:error.message});
}
}

exports.updateUser = async function (req, res) {
    try {
      let userId = req.params.userId
      let userData = req.body
      if(Object.keys(userData).length == 0){
        return res.status(400).send({status:"false", message:"please enter some data to update"});
    }
    
    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"invalid userid"});
    }
  
      let { name, email, password, company, question, answer} = userData;

       // Email validation using regex
       if(email){
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if(!emailRegex.test(email)){
           return res.status(400).send({status: false, message: "Invalid email address."});
       }
    }

       // Password validation using regex
       if(password){  
         const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
       if(!passwordRegex.test(password)){
           return res.status(400).send({status: false, message: "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."});
       }}
  
      let user = await userModel.findById(userId);
      if(!user) return res.status(400).send({status: false, message: "User not found."});
    
    if (name) user.name = name;
  
  if(email){
    let duplicateEmail = await userModel.findOne({ email: email });
    if (duplicateEmail){ return res.status(400).send({ status: false, message: "this email already exists" });
    }else{
        user.email = email;
    }
    }
    
  
    if (password) {
        let hash = await bcrypt.hash(password, 10);
        user.password = hash;
    }
    
    if(company){
        user.company= company;
    }
    if(question){
        user.secretQuestion.question= question;
    }
    if(answer){
        user.secretQuestion.answer= answer;
    }
  
     let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, user, { new: true });
      return res.status(200).send({ status: true, message: "User profile updated"});
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  }


