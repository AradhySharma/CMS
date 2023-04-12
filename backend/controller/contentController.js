const userModel = require("../model/userModel");
const mongoose = require ("mongoose");
const {isValidObjectId} = mongoose;
const projectModel = require("../model/projectModel");
const contentModel = require("../model/contentModel");
const contentHistory = require("../model/contentHistory");
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1",
})

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: '2006-03-01' });


        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }


        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
        


    })
}

exports.createContent = async function(req, res){
  try{
    const {_id}= req.user; 
    let data = req.body
    let files = req.files

    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please provide data" })

            // validation for createdBy //
            if (!data.createdBy) return res.status(400).send({ status: false, message: "createdBy is mandatory" })
            data.createdBy = data.createdBy.trim()
            if (!isValidObjectId(data.createdBy)){
            return res.status(400).send({ status: false, message: "Invalid createdBy" });
            }

            // validation for project //
            if (!data.project) return res.status(400).send({ status: false, message: "project is mandatory" })
            data.project = data.project.trim()
            if (!isValidObjectId(data.project)){
            return res.status(400).send({ status: false, message: "Invalid project" });
            }

        // validation for title//
        if (!data.title) return res.status(400).send({ status: false, message: "title is mandatory" })


        // validation for title
        if (!data.type) return res.status(400).send({ status: false, message: "type is mandatory" })

          //Authorization -----------------------------------------------------------------------------------------
          if (_id!= data.createdBy) return res.status(403).send({ status: false, message: "you are not authorized"})



    const { project, createdBy } = data; // Content data from request body

    

    const projectData = await projectModel.findById(project);
    if (!projectData) {
      return res.status(404).json({ status: false, message: "Project not found" });
    }

    // Check if createdBy user exists
    const createdByData = await userModel.findById(createdBy);
    if (!createdByData) {
      return res.status(404).json({ status: false, message: "Created by user not found" });
    }

       // Check if createdBy user is part of the project team and has the required role
       const isTeamMember = projectData.team.some(teamMember => teamMember.user.toString() === _id.toString()&&(teamMember.role === 'ADMIN'||teamMember.role === 'EDITOR'||teamMember.role === 'PUBLISHER'));
       if (!isTeamMember){
         return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
       }

    if (files && files.length > 0) {
        var fileLink = await uploadFile(files[0])
        if (!fileLink) {
            return res.status(404).send({ status: false, message: "no file found" })
        }else{
            data.content = fileLink
        }
    }

    let savedata = await contentModel.create(data)
    res.status(201).send({ status: true, msg:"Content has been created"})

  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  }

}


exports.updateContent = async function(req, res){
  try{
    let contentId = req.params.contentId;
    const {_id}= req.user; 
    let data = req.body
    let files = req.files

    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please provide data" })


            // validation for contntId //
            if (!contentId) return res.status(400).send({ status: false, message: "contentId is mandatory" })
            contentId = contentId.trim()
            if (!isValidObjectId(contentId)){
            return res.status(400).send({ status: false, message: "Invalid contentId" });
            }

    const contentData = await contentModel.findById(contentId);
    if (!contentData) {
      return res.status(404).json({ status: false, message: "content not found" });
    }

    const projectId = contentData.project

    const projectdata = await projectModel.findById(projectId)


         // Check if createdBy user is part of the project team and has the required role

         const isTeamMember = projectData.team.some(teamMember => teamMember.user.toString() === _id.toString()&&(teamMember.role === 'ADMIN'||teamMember.role === 'EDITOR'||teamMember.role === 'PUBLISHER'));
         if (!isTeamMember){
           return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
         }

    if (files && files.length > 0) {
        var fileLink = await uploadFile(files[0])
        if (!fileLink) {
            return res.status(404).send({ status: false, message: "no file found" })
        }else{
            data.content = fileLink
        }
    }

        // Save current content as revision in history model
        const revision ={
            contentId: contentData._id,
            version: contentData.version + 1,
            title: contentData.title,
            type: contentData.type,
            content: contentData.content,
            createdBy: contentData.createdBy
          };
      
          await contentHistory.create(revision)

          contentData.title = data.title;
          contentData.description = data.description;
          contentData.type = data.type;
          contentData.content = data.content;
          contentData.version = contentData.version + 1;
          contentData.updatedBy = _id;
          contentData.updatedAt = new Date();
      
          // Save updated content to the database
          await contentData.save();

    // Return updated project data
    res.status(200).json({ status: true, msg:"Content has been updated "});
  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  }

}

exports.getContentById = async function(req, res){
  try{
    let contentId = req.params.contentId; // Get content ID from URL parameter
    const {_id}= req.user; 

    if (!contentId) return res.status(400).send({ status: false, message: "contentId is mandatory" })
    contentId = contentId.trim()
    if (!isValidObjectId(contentId)){
    return res.status(400).send({ status: false, message: "Invalid contentId" });
    }


    // Find content by ID in the database
    const content = await contentModel.findById(contentId);

    const projectId = content.project

    const project = await projectModel.findById(projectId)

    //verify content.project.team have loged in user
    const isTeamMember = project.team.some(teamMember => teamMember.user.toString() === _id.toString());
    if (!isTeamMember) {
      return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
    } 

    if (!content) {
      return res.status(404).json({ status: false, message: 'Content not found' });
    }

    // Return content data
    res.status(200).json({ status: true, data: content });
    
  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  }
    
}

exports.getContents = async function(req, res){
  try{
    const project = req.params.projectId; // Get projectId from URL parameter
    if (!isValidObjectId(project)){
      return res.status(400).send({ status: false, message: "Invalid projectId" });
      }

    // Find project by projectId in the database
    const projectData = await projectModel.findById(project);

    // Check if project exists
    if (!projectData) {
      return res.status(404).json({ status: false, message: 'Project not found' });
    }

    
    const {_id}= req.user;  // Get createdBy user from authenticated user data

    // Check if logedin user is part of the project team
    const isTeamMember = projectData.team.some(teamMember => teamMember.user.toString() === _id.toString());
    if (!isTeamMember){
      return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
    }

    // Find all contents associated with the project
    const contents = await contentModel.find({ project });

    // Return contents data
    res.status(200).json({ status: true, data: contents });
    
  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  }
    
}

exports.deleteContent = async function(req, res){
  try{

    const contentId = req.params.contentId; 

    if (!isValidObjectId(contentId)){
      return res.status(400).send({ status: false, message: "Invalid contentId" });
      }
    
    const content = await contentModel.findOne({ _id: contentId, isDeleted: false })

    if (!content) {
      return res.status(404).json({ status: false, message: 'Content not found' });
    }

    const projectId = content.project

    const project = await projectModel.findById(projectId)

    const {_id}= req.user; 

    if (project.admin.toString() !== _id.toString()) {
      return res.status(403).json({status:false, msg:' You do not have permission to update this project.' });
    }

    const updatedcontent = await contentModel.findByIdAndUpdate(contentId, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        res.status(200).send({ status: true, message: "content deleted succesfully" })

  
      }catch(error){
        return res.status(500).send({status:false,msg: error.message})
      }

    
}

exports.publishContent = async function(req, res){
  try{
    const contentId = req.params.contentId; // Get contentId from URL parameter
    if (!isValidObjectId(contentId)){
      return res.status(400).send({ status: false, message: "Invalid contentId" });
      }

    // Find content by contentId in the database
    const content = await contentModel.findById(contentId);

    // Check if content exists
    if (!content) {
      return res.status(404).json({ status: false, message: 'Content not found' });
    }

    // Find project by projectId in the database
    const projectData = await projectModel.findById(content.project);


    // Check if project exists
    if (!projectData) {
      return res.status(404).json({ status: false, message: 'Project not found' });
    }

    const {_id}= req.user; // Get logedinuser from authenticated user data

    // Check if createdBy user is part of the project team and has the required role

    const isTeamMember = projectData.team.some(teamMember => teamMember.user.toString() === _id.toString()&&(teamMember.role === 'ADMIN'||teamMember.role === 'PUBLISHER'));
    if (!isTeamMember){
      return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
    }
    

    // Update content status to 'published' in the database
    content.draft = false;
    await content.save();

    // Return success message
    res.status(200).send({ status: true, message:'Content published successfully'});
    
  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  }
   
}


exports.getHistory = async function(req, res){
  try{
    const contentId = req.params.contentId; // Get contentId from URL parameter

    if (!isValidObjectId(contentId)){
      return res.status(400).send({ status: false, message: "Invalid contentId" });
      }
    

    // Find content by contentId in the database
    const content = await contentModel.findById(contentId);

    // Check if content exists
    if (!content) {
      return res.status(404).json({ status: false, message: 'Content not found' });
    }

    const project = await projectModel.findById(content.project);


    // Check if project exists
    if (!project) {
      return res.status(404).json({ status: false, message: 'Project not found' });
    }

    const {_id}= req.user; // Get logedinuser from authenticated user data

    // Check if logedin user is part of the project team 
    const isTeamMember = project.team.some(teamMember => teamMember.user.toString() === _id.toString());
    if (!isTeamMember) {
      return res.status(403).send({ status:false,msg:'You do not have permission to access this project.' });
    }

    // Retrieve revision history from history model
    const history = await contentHistory.find( {contentId:contentId} );

    // Return revision history in the response
    res.status(200).send({ status: true, message: 'history retrieved successfully', data: history });
    
  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  }   
}

exports.rollback = async function(req, res){
  try{
    const contentId = req.params.contentId;

    if (!isValidObjectId(contentId)){
      return res.status(400).send({ status: false, message: "Invalid contentId" });
      }

    const {_id}= req.user; // Get logedinuser from authenticated user data
    
    // Find the content item by ID
    const content = await contentModel.findById(contentId);
    if (!content) {
      return res.status(404).json({ status: false, message: 'Content not found' });
    }

    const version = content.version

    // Find the content item with the desired revision number
    const previousHistory = await contentHistory.findOne({ contentId, version: version - 1 });
    if (!previousHistory) {
      return res.status(404).json({ status: false, message: 'Previous revision not found' });
    }

    // Rollback the content item to the previous revision
    content.title = previousHistory.title;
    content.description = previousHistory.description;
    content.type = previousHistory.type;
    content.content = previousHistory.content;
    content.updatedBy = _id;
    content.updatedAt = Date.now();
    content.version = version;


    // Save the updated content item
    await content.save();

    return res.status(200).send({ status: true, message: 'Content rolled back to previous revision'}); 
  
  }catch(error){
    return res.status(500).send({status:false,msg: error.message})
  } 
}
