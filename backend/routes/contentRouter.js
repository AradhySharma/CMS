const express = require("express");
const{authentication2}= require("../middlewares/auth.js")
const {createContent,updateContent,getContentById,getContents,deleteContent,publishContent,getHistory,rollback}= require("../controller/contentController.js")

const contentRouter = express.Router();

contentRouter.post("/create-content",authentication2, createContent);

contentRouter.put("/update-content/:contentId",authentication2, updateContent);
contentRouter.get("/get-content/:contentId",authentication2, getContentById);
contentRouter.get("/:projectId/get-contents",authentication2, getContents);
contentRouter.delete("/delete-content/:contentId",authentication2, deleteContent);
contentRouter.put("/publish-content/:contentId",authentication2, publishContent);
contentRouter.get("/:contentId/get-history",authentication2, getHistory);
contentRouter.post("/:contentId/rollback",authentication2, rollback);

module.exports = contentRouter;