const mongoose = require("mongoose")

const dbConnect = async () => {
try{
await mongoose.connect("mongodb+srv://Aradhybly81:Aradhybly81@cluster0.tw2agat.mongodb.net/");
console.log("db connected successfully");

}catch(error){
        console.log("DB Connection faild", error.message)

    }
};

dbConnect();