const userModel = require("../model/userModel");
const mongoose = require ("mongoose");
const {isValidObjectId} = mongoose;
const projectModel = require("../model/projectModel");

exports.createProject = async function(req,res){
    try{
        // Extract project input from request body
    const { name, description } = req.body;
    const {_id}= req.user;
    if(!name){
      return res.status(400).send({status:"false", message:"name is mandatory "});
  }
  if(!description){
      return res.status(400).send({status:"false", message:"description is mandatory "});
  }
    const data ={
        name,
        description,
        admin: _id, // Set the admin as the logged-in user
        team: [{ user: _id, role: 'ADMIN' }] // Add the logged-in user as a team with ADMIN role
      };

    let project = await projectModel.create(data)
    return res.status(201).send({status:"true", message:"Project has been created sucssesfuly"})

    }catch(error){
        return res.status(500).send({status:false,msg: error.message})
    }
}

exports.getProjects = async function(req,res){
    try{
        const {_id}= req.user; // ID of the logged-in user

        // Find all projects where the logged-in user is a team
        const projects = await projectModel.find({ 'team.user': _id });

        if(!projects){
          res.status(400).send({status:false, msg:"project not found"})
        }
        // Return the projects data
        return res.status(200).send({ status:true,data: projects });

      }catch(error){
        return res.status(500).send({status:false,msg: error.message})
    }
}

exports.addTeam =async function(req,res){
  try {
    const projectId = req.params.projectId; // ID of the project to add the user to
    if (!isValidObjectId(projectId)) {
      return res.status(400).send({ status: false, message: "Invalid projectId" });
    }

    const { email, role } = req.body; // Email and role of the user to be added
    if (!email) {
      return res.status(400).send({ status: false, message: "Email is mandatory" });
    }
    if (!role) {
      return res.status(400).send({ status: false, message: "Role is mandatory" });
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ status: false, message: "Invalid email address" });
    }

    const { _id } = req.user;
    // Find the project by ID
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ status: false, msg: "Project not found" });
    }

    // Check if the logged-in user has permission to add users to the project
    if (project.admin.toString() !== _id.toString()) {
      return res.status(403).json({ error: "Access denied. You do not have permission to add users to this project" });
    }

    // Find the user by email
    const userData = await userModel.findOne({ email });
    if (!userData) {
      return res.status(404).send({ status: false, error: "User not found" });
    }

    const existingTeam = project.team.find(user => user.toString() === userData._id.toString());

    if (existingTeam) {
      return res.status(400).json({ status: false, error: "User is already a team member in this project" });
    }

    // Add the user as a collaborator with the specified role
    project.team.push({ user: userData._id, role });
    await project.save();
    // Return the updated project data
    return res.status(200).send({ status: true, msg:"User has been added successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
}

exports.updateProject = async function(req,res){
    try{
        const projectId = req.params.projectId; // ID of the project to update
        const updatedProject = req.body; // Updated project data from request body
        const {_id}= req.user;

        // Find the project by ID
        const project = await projectModel.findById(projectId);
    
        if (!project) {
          return res.status(404).json({ error: 'Project not found.' });
        }
    
        // Check if the logged-in user has permission to update the project
        if (project.admin.toString() !== _id.toString()) {
          return res.status(403).json({status:false, msg:' You do not have permission to update this project.' });
        }
    
        // Update the project data
        if(updatedProject.name){
        project.name = updatedProject.name;
        }
        if(updatedProject.description){
        project.description = updatedProject.description;
        }
        project.updatedAt = new Date();
    
        await project.save();
    
        // Return the updated project data
        return res.status(200).send({status:true, msg:"project updataed"});


    }catch(error){
        return res.status(500).send({status:false,msg: error.message})
    }
}

exports.getProjectsById = async function(req,res){
 try{
    const projectId = req.params.projectId;
    const {_id}= req.user;

    if(!isValidObjectId(projectId)){
      return res.status(400).send({status:false,message:"invalid projectId"});
  }

    // Find the project in the database by its ID
    const project = await projectModel.findById(projectId);


    // If project not found, return an error
    if (!project) {
      return res.status(404).send({ error: 'Project not found.' });
    }
        // Check if the logged-in user is a team member of the project
        const isTeamMember = project.team.some(teamMember => teamMember.user.toString() === _id.toString());
        if (!isTeamMember) {
          return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
        }

    // Return the project in the API response
    return res.status(200).send({ status:true,data:project });

 }catch(error){
    return res.status(500).send({status:false,msg: error.message})

 }
}

exports.deleteProject = async function(req,res){
   try{
    let projectId = req.params.projectId;

      const {_id}= req.user;

    if(!isValidObjectId(projectId)){
        return res.status(400).send({status:false,message:"invalid projectId"});
    }
       
        let checkProjectId = await projectModel.findById(projectId);
        if (!checkProjectId || (checkProjectId.isDeleted == true)) {
            return res.status(404).send({ status: false, msg: "Project has been already deleted" })
        }

if (checkProjectId.admin.toString() !== _id.toString()) {
    return res.status(403).json({status:false, error: 'Access denied. You do not have permission to update this project.' });
  }

const deletedProject = await projectModel.findOneAndUpdate({ _id: projectId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
        return res.status(200).send({
            status: true, msg: "Project has been deleted successfully"
        });

   }catch(error){
    return res.status(500).send({status:false,msg: error.message})
   }
}





