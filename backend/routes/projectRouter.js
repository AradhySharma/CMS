const express = require("express");
const {createProject,getProjects,addTeam,updateProject,getProjectsById,deleteProject} = require("../controller/projectController")
const{authentication2}= require("../middlewares/auth.js")




const projectRouter = express.Router();

//create-project
projectRouter.post("/create-project",authentication2, createProject);
////get-project
projectRouter.get("/get-projects",authentication2,getProjects);
// //add-Team
projectRouter.post("/add-team/:projectId",authentication2,addTeam);
//update-Project
 projectRouter.put("/update-project/:projectId",authentication2,updateProject);
// //getProjectsById
 projectRouter.get("/get-project-by-id/:projectId",authentication2, getProjectsById);
//delete-Project
projectRouter.delete("/delete-project/:projectId",authentication2, deleteProject);



module.exports = projectRouter;