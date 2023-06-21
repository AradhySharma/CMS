# CMS(content management system)
### Mentor: Asit Prakash 
### Assigned to: Aradhy Sharma

## Overview: 

The CMS tool is a content management system designed to allow users of the same company to manage different types of content such as text, email, image, audio, and video. The tool provides various features such as authentication, drafting, publishing, and more to simplify the content management process.



## Key points

- User Authentication and Authorization:

- In order to utilize any features offered by the platform, users are required to register and log in using their email and password. The platform consists of three distinct user roles, namely VIEWER, EDITOR, and PUBLISHER, each with varying degrees of access privileges. The ADMIN role grants complete access to all platform functions for a particular project, while the SUPERADMIN role provides access to all functions across all projects in the platform.

- Roles, other than SUPERADMIN, are assigned on a per-project basis. When a user creates a project, they automatically become the admin and can assign different users from their company to different roles.

- When registering, users must provide their name, current company, email address, and password. Additionally, the platform offers a "Forgot Password" feature for users who need to reset their login credentials.




## Workflow


- Users signup and then login to platform


- Can create a project or see existing project they are part of

- In existing projects they can perform as per their role

- Can create project and assign multiple team members by searching team members from their own company( system should give search results for the same company as the user from who is searching)

- Inside a project multiple contents can be created and managed.

- Whenever a content is edited a draft copy will be generated and there should be an option to publish

- There should be a history section for each content which will show previous version of content

- The content can be rolled back to previous version

- Signed in user can see all the projects they are part of for diff roles. User Profile Users can update their profile info



## Models

#### User Model

```http
  {
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true,lowercase: true},
  password: { type: String, required: true},
  company: { type: String, required: true},
  secretQuestion:{ question:{ type:String, required:true },answer:{type:String, required:true}}
  }
```



#### Project Model

```http
  {
  name: {type: String, required: tru},
  description: {type: String, required: true},
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['VIEWER', 'EDITOR', 'PUBLISHER', 'ADMIN'],
      default: 'VIEWER'
    }
  }],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}
```


#### Content Model

```http
{
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'email', 'image', 'audio', 'video', 'pdf'], required: true },
    content: { type: String, required: true },
    version: {type: Number,default: 1}, 
    draft: { type: Boolean, default: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    isDeleted: {type: Boolean, default: false},  
    deletedAt: {type: Date}, 
  }
```




#### Content History

```http
{
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    version: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'email', 'image', 'audio', 'video'], required: true },
    content: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, default: 'null'},
    createdOn: { type: Date, default: Date.now }
  }
```





## Features

### User APIs

#### User Registration API

##### API Method: POST 

##### URL: api/v1/users/register

##### Sample Request Body: 


```http
{ 
"name": "anu Sharma",
"company": "FunctionUP",
"email": "anu@gmail.com",
"password": "Password12342@", 
"secretQuestion":{
"question": "what is your school name",
"answer": "RPKD"
} 
}
```
##### Sample Response Body:


```http
{
"status": "true",
"message": "User has been created sucssesfuly",
"data": { 
"name": "anu Sharma", 
"email": "anu@gmail.com",
"password": "$2b$10$Hl3hw3wXxK113LCOPdHShO1IG0oZ53fVzziKUIxOilh3c1Qhr0bDa",
"company": "FunctionUP", 
"secretQuestion": { 
"question": "what is your school name", 
"answer": "RPKD" 
}
}
}
```

#### User Login API

##### API Method: POST 

##### URL:  api/v1/users/login

##### Sample Request Body: 

```http
{
"email": "anu@gmail.com",
"password": "Password12342@" 
} 
```
##### Sample Response Body:

```http
{
"status": true, 
"message": "logged in successfuly" 
}
In header : "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

```


#### Forgot Password API

##### API Method: POST 

##### URL:  api/v1/users/forget-password

##### Sample Request Body: 

```http
{
"email": "anu@gmail.com" 
} 
```
##### Sample Response Body:

```http
{ 
"status": true, 
"data": { 
"email": "anu@gmail.com", 
"question": "what is your school name" 
} 
}
```

#### reset password API

##### API Method: POST 

##### URL:  api/v1/users/reset-password

##### Sample Request Body: 

```http
{ 
"email": "anu@gmail.com", 
"newPassword": "anu9817@", 
"secretQuestion": "what is your school name", "secretAnswer": "RPKD" 
}
```
##### Sample Response Body:

```http
{ 
"status": true, 
"msg": "Password reset successfully" 
}
```

#### update user API

##### API Method: POST 

##### URL:  api/v1/users/update-User/:userId

##### Sample Request Body: 

```http
{ 
"name": "Arpit Sharma"
}
```
##### Sample Response Body:

```http
{ 
"status": true, 
"message": "User profile updated", 
"data": { 
"secretQuestion": { 
"question": "what is your school name", 
"answer": "RPKD" 
}, 
"name": "Arpit Sharma", 
"email": "yash@gmail.com", 
"password": "$2b$10$Sg.di9373aL59gM46Jz9duLcB703xMQZFCieW/ygNQiGC8U9rUdsW", 
"company": "FunctionUP", 
"role": "VIEWER", 
"createdAt": "2023-04-09T17:14:57.854Z", 
"updatedAt": "2023-04-11T09:41:31.590Z", 
}
}
```

### project APIs

#### Create Project API

##### API Method: POST 

##### URL:  /api/v1/projects/create-project

##### Sample Request Body: 

```http
{
"name": "Project N",
"description": "This is a sample project"
} 
```
##### Sample Response Body:

```http
{
"status": "true",
"message": "Project has been created sucssesfuly", 
"data": { 
"name": "Project T", 
"description": "This is a sample project", 
"admin": "643407d049d5aebc52113948", 
"team": [ { "user": "643407d049d5aebc52113948", "role": "ADMIN", "_id": "643628f670d90df5a8b6a549" } ], "isDeleted": false, 
"_id": "643628f670d90df5a8b6a548", 
"createdAt": "2023-04-12T03:43:50.385Z", 
"updatedAt": "2023-04-12T03:43:50.385Z", 
"__v": 0 
} 
}
```


#### Get Project API

##### API Method:  GET

##### URL:  /api/v1/projects/get-projects

##### Sample Response Body:

```http
{ 
"status": true, 
"data": [ 
{ 
"_id": "6432f4ad42f9cd2867750c5f", 
"name": "redCar", 
"description": "This is a sample project", 
"admin": "6432f2911f9cad28eb2744d4", 
"team": [ 
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "ADMIN", 
"_id": "6432f4ad42f9cd2867750c60" 
},
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "EDITOR", 
"_id": "6432f99fcd05df4d7ffbaf88"
} 
], 
"isDeleted": true, 
"createdAt": "2023-04-09T17:23:57.510Z", 
"updatedAt": "2023-04-09T17:45:03.875Z", 
"__v": 1, 
"deletedAt": "2023-04-09T17:28:13.944Z"
}, 
{ 
"_id": "6434082449d5aebc5211394c", 
"name": "Project T", 
"description": "This is a sample project", 
"admin": "643407d049d5aebc52113948", 
"team": [ 
{
"user": "643407d049d5aebc52113948", 
"role": "ADMIN", 
"_id": "6434082449d5aebc5211394d" 
}, 
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "EDITOR", 
"_id": "64340a4d2df766bca21e11ee" 
} 
],
"isDeleted": false, 
"createdAt": "2023-04-10T12:59:16.996Z", 
"updatedAt": "2023-04-10T13:08:29.489Z", 
"__v": 1 
} 
] 
}
```


#### Get Project by Id

##### API Method: GET

##### URL:  /api/v1/projects/get-project-by-id/:projectId

##### Sample Response Body:

```http
{ 
"status": true, 
"data": 
{ 
"_id": "6432f4ad42f9cd2867750c5f", 
"name": "redCar", 
"description": "This is a sample project", 
"admin": "6432f2911f9cad28eb2744d4", 
"team": [ 
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "ADMIN", 
"_id": "6432f4ad42f9cd2867750c60"
}, 
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "EDITOR", 
"_id": "6432f99fcd05df4d7ffbaf88" 
} 
], 
"isDeleted": true, 
"createdAt": "2023-04-09T17:23:57.510Z", 
"updatedAt": "2023-04-09T17:45:03.875Z", 
"__v": 1, 
"deletedAt": "2023-04-09T17:28:13.944Z" 
} 
}
```


#### addTeam API

##### API Method: POST 

##### URL:  /api/v1/projects/add-team/:projectId

##### Sample Request Body: 

```http
{ 
"email": "yash@gmail.com", 
"role":"EDITOR" 
}
```
##### Sample Response Body:

```http
{ 
"status": true, 
"data": { 
"_id": "6434082449d5aebc5211394c",
"name": "Project T", 
"description": "This is a sample project", 
"admin": "643407d049d5aebc52113948", 
"team": [ 
{ 
"user": "643407d049d5aebc52113948", 
"role": "ADMIN", 
"_id": "6434082449d5aebc5211394d" 
},
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "EDITOR", 
"_id": "64340a4d2df766bca21e11ee" 
}, 
], 
"isDeleted": false, 
"createdAt": "2023-04-10T12:59:16.996Z", 
"updatedAt": "2023-04-12T03:53:41.581Z", 
"__v": 2 
} 
}
```


#### update project API

##### API Method: PUT 

##### URL:  /api/v1/projects/update-project/:projectId

##### Sample Request Body: 

```http
{ 
"name":"redCar" 
}
```
##### Sample Response Body:

```http
{ 
"status": true, 
"msg": "project updataed", 
"data": { 
"_id": "6432f4ad42f9cd2867750c5f", 
"name": "redCar", 
"description": "This is a sample project", 
"admin": "6432f2911f9cad28eb2744d4", 
"team": [ 
{ 
"user": "6432f2911f9cad28eb2744d4",
"role": "ADMIN", 
"_id": "6432f4ad42f9cd2867750c60" 
}, 
{ 
"user": "6432f2911f9cad28eb2744d4", 
"role": "EDITOR", 
"_id": "6432f99fcd05df4d7ffbaf88"
} 
], 
"isDeleted": true, 
"createdAt": "2023-04-09T17:23:57.510Z", 
"updatedAt": "2023-04-12T03:59:01.784Z", 
"__v": 1, 
"deletedAt": "2023-04-09T17:28:13.944Z" 
} 
}
```


#### delete project API

##### API Method: DELETE 

##### URL:  /api/v1/projects/delete-project/:projectId

##### Sample Request Body: 

```http 
{ 
"isDeleted":"true" 
}
```
##### Sample Response Body:

```http
{ 
"status": true, 
"msg": "Project has been deleted successfully", 
"data": { 
"_id": "64362de1c5195f714ec289be", 
"name": "Project T", 
"description": "This is a sample project", 
"admin": "643507ddda06750dcacad5d0", 
"team": 
[ 
{ 
"user": "643507ddda06750dcacad5d0", 
"role": "ADMIN", 
"_id": "64362de1c5195f714ec289bf" 
} 
], 
"isDeleted": true, 
"createdAt": "2023-04-12T04:04:49.525Z", 
"updatedAt": "2023-04-12T04:05:33.337Z", 
"__v": 0, 
"deletedAt": "2023-04-12T04:05:33.333Z" 
} 
}
```


### Content APIs

#### Create Content API

##### API Method: POST 

##### URL:  /api/v1/contents/create-content

##### Sample Request Body: 

```http
send by form data-

title - bio homework type 
image content - Where to get math homework help.jpg 
project - 6434082449d5aebc5211394c 
createdBy - 643407d049d5aebc52113948
```
##### Sample Response Body:

```http
{ 
"status": true, 
"data": { 
"title": "bio homework", 
"type": "image",
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"version": 1, 
"draft": true, 
"project": "6434082449d5aebc5211394c", 
"createdBy": "643407d049d5aebc52113948", 
"isDeleted": false, 
"_id": "64362ef3c5195f714ec289cc", 
"createdOn": "2023-04-12T04:09:23.083Z", 
"updatedOn": "2023-04-12T04:09:23.083Z", 
"__v": 0 
} 
}
```


#### update Content API

##### API Method: PUT 

##### URL:  /api/v1/contents/update-content/:contentId

##### Sample Request Body: 

```http
send by form data-

title - hindi homework type 
image content - Where to get hindi homework help.jpg
```
##### Sample Response Body:

```http
{ 
"status": true,
"data": { 
"_id": "64339d208abf6db448c0576d", 
"title": "hindi homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"draft": true, 
"project": "6432f4ad42f9cd2867750c5f", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-10T05:22:40.574Z", 
"updatedOn": "2023-04-10T05:22:40.574Z", 
"__v": 0, 
"isDeleted": false, 
"updatedBy": "6432f2911f9cad28eb2744d4", 
"version": 4 
} 
}
```

#### Get Contet by id API

##### API Method: GET 

##### URL:  /api/v1/contents/get-content/:contentId

##### Sample Response Body:

```http
{ 
"status": true, 
"data": { 
"_id": "64339d208abf6db448c0576d", 
"title": "hindi homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"draft": true, 
"project": "6432f4ad42f9cd2867750c5f", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-10T05:22:40.574Z", 
"updatedOn": "2023-04-10T05:22:40.574Z", 
"__v": 0, 
"isDeleted": false, 
"updatedBy": "6432f2911f9cad28eb2744d4", 
"version": 4 
} 
}
```


#### Get Contents API

##### API Method: GET  

##### URL:  /api/v1/contents/:projectId/get-contents

##### Sample Response Body:

```http
{ 
"status": true, 
"data": [ 
{ 
"_id": "64339d208abf6db448c0576d", 
"title": "hindi homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"draft": true, 
"project": "6432f4ad42f9cd2867750c5f", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-10T05:22:40.574Z", 
"updatedOn": "2023-04-10T05:22:40.574Z", 
"__v": 0, 
"isDeleted": false, 
"updatedBy": "6432f2911f9cad28eb2744d4", 
"version": 4 
} 
] 
}
```


#### Delete Content API

##### API Method: DELETE   

##### URL:  /api/v1/contents/delete-content/:contentId

##### Sample Response Body:

```http
{ 
"status": true, 
"message": "content deleted succesfully" 
}
```



#### Get History API

##### API Method: GET    

##### URL:  /api/v1/contents/:contentId/get-history 

##### Sample Response Body:

```http
{ 
"status": true, 
"message": "history retrieved successfully", 
"data": [ 
{ 
"_id": "6434c2b923c8ccab40109ff3", 
"contentId": "64339d208abf6db448c0576d", 
"version": 2, 
"title": "math homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-11T02:15:21.449Z", 
"__v": 0 
}, 
{
"_id": "6434ea3db33a170560c71e9a", 
"contentId": "64339d208abf6db448c0576d", 
"version": 3, 
"title": "scince homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-11T05:03:57.324Z", 
"__v": 0 
}, 
{ 
"_id": "643631af2b3ef58b2608b13a", 
"contentId": "64339d208abf6db448c0576d", 
"version": 4, 
"title": "math homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-12T04:21:03.630Z", 
"__v": 0 
} 
]
}
```



#### Get rollback API

##### API Method: POST   

##### URL:  /api/v1/contents/:contentId/rollback

##### Sample Response Body:

```http
{ 
"status": true, 
"message": "Content rolled back to previous revision", "data": { 
"_id": "64339d208abf6db448c0576d", 
"title": "scince homework", 
"type": "image", 
"content": "https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/abc/Where%20to%20get%20math%20homework%20help.jpg", 
"draft": true, 
"project": "6432f4ad42f9cd2867750c5f", 
"createdBy": "6432f2911f9cad28eb2744d4", 
"createdOn": "2023-04-10T05:22:40.574Z", 
"updatedOn": "2023-04-10T05:22:40.574Z", 
"__v": 0, 
"isDeleted": true, 
"updatedBy": "6432f2911f9cad28eb2744d4", 
"version": 4, 
"deletedAt": "2023-04-12T04:51:14.873Z" 
} 
}
```












