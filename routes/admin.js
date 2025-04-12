const { Router } = require('express');
const { adminModel, courseModel } = require('../db');
const adminRouter = Router();
const bcrypt = require('bcrypt');
const { JWT_ADMIN } = require('../config');
const {adminMiddleware} =  require('../middlewares/admin')
const jwt = require('jsonwebtoken')
const {z} = require('zod')

adminRouter.post("/signup",async (req,res)=>{
    const reqBody = z.object({
        email : z.string().email(),
        password : z.string(),
        firstName : z.string(),
        lastName : z.string()
    })

    const parsedSuccess = reqBody.safeParse(req.body)
    if(!parsedSuccess.success){
        return res.json({
            msg : "Invalid Format"
        })
    }

    const {email,password,userId,firstName,lastName} = req.body;
    const hashedPassword = await bcrypt.hash(password,5);
    try{
        await adminModel.create({
            email,password : hashedPassword,userId,firstName,lastName
        })
    }
    catch(e){
        return res.json({
            msg : "Cannot push admin maybe you are signed in"
        })
    }

    res.json({
        msg : "Signup Successfull!"
    })
})

adminRouter.post("/signin",async (req,res)=>{
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string()
    });
    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if(!parseDataWithSuccess.success){
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const {email,password} = req.body;
    const admin = await adminModel.findOne({
        email
    })

    if(!admin){
        return res.json({
            msg : "Admin not found"
        })
    }

    const passCheck = await bcrypt.compare(password,admin.password);

    if(!passCheck){
        return res.json({
            msg : "Password did't match"
        })
    }

    const token = jwt.sign({
        id : admin._id
    },JWT_ADMIN)

    return res.json({
        msg : "Signin Successfull!",
        token : token
    })

})

adminRouter.post("/course",adminMiddleware,async (req,res)=>{

    const adminId = req.adminId;

    const requireBody = z.object({
        title: z.string(),
        description: z.string(),
        price: z.number().positive(),
    });

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if(!parseDataWithSuccess){
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const {title,description,price} = req.body;

    const course = await courseModel.create({
        title,description,price,creatorId : adminId
    })

    res.json({
        msg : "Course created"
    })

})

adminRouter.put("/course",adminMiddleware, async (req,res)=>{
    const adminId = req.adminId;

    const requireBody = z.object({
        courseId: z.string(),
        title: z.string(),
        description: z.string(), 
        price: z.number().positive()
    });

    
    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if(!parseDataWithSuccess.success){
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const {courseId,title,description,price} = req.body;

    const course = await courseModel.findOne({
        _id : courseId,
        creatorId : adminId
    })

    if(!course){
        return res.json({
            msg : "Course not found"
        })
    }

    await courseModel.updateOne({
        _id : courseId,
        creatorId : adminId
    },{
        title : title || course.title,
        description : description || course.description,
        price : price || course.price
    })

    res.json({
        msg : "Course updated"
    })
})

module.exports = {
    adminRouter
}