const jwt = require('jsonwebtoken')
const {Router} = require('express')
const userRouter = Router();
const {z} = require('zod');
const { userModel, purchaseModel, courseModel } = require('../db');
const bcrypt = require('bcrypt')
const {JWT_USER} = require('../config.js');
const { userMiddleware } = require('../middlewares/user.js');


userRouter.post("/signup",async (req,res)=>{
    // validation check
    const requestBody = z.object({
        email : z.string().email(),
        password : z.string(),
        firstName : z.string(),
        lastName : z.string()
    })

    const parsedBody = requestBody.safeParse(req.body);
    
    if(!parsedBody.success){
        res.json({
            message : "Incorrect Format"
        })
    }
    else{
        const {email,password,firstName,lastName} = req.body;
        const hashedPassword = await bcrypt.hash(password,5);
        try{
            await userModel.create({
                email,password : hashedPassword,firstName,lastName
            })
        }
        catch(e){
            return res.json({
                msg : "Error while pushing to database"
            })
        }
        res.json({
            msg : "Signup Successfull!"
        })
        
    }
})

userRouter.post('/signin',async (req,res)=>{
    const requestBody = z.object({
        email : z.string().email(),
        password : z.string()
    })

    const parsedBody = requestBody.safeParse(req.body);
    if(!parsedBody.success){
        return res.json({
            msg : "Invalid Format"
        })
    }
    else{
        const {email,password} = req.body;
        const user = await userModel.findOne({
            email
        })
        if(!user){
            return res.json({
                msg : "There is no user with this email"
            })
        }

        const passwordMatch = await bcrypt.compare(password,user.password);

        if(passwordMatch){
            const token = jwt.sign({
                id : user._id
            },JWT_USER)
            
            return res.json({
                msg : "Sign in Successfull",
                token : token
            })
        }
        else{
            return res.json({
                msg : "Password Didn't match"
            })
        }
    }
})

userRouter.get("/purchase",userMiddleware,async (req,res)=>{
    const userId = req.userId;
    const userPurchases = await purchaseModel.find({
        userId : userId
    })

    const purchaseId = userPurchases.map((user) => user.courseId);
    //[123,213,124]
    const courses = await courseModel.find({
        _id : {$in : purchaseId}
    })

    return res.json({
        courses : courses
    })

})

module.exports = {
    userRouter
}





