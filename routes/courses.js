const {Router} = require('express');
const {courseModel,purchaseModel} = require('../db')
const courseRouter = Router();

const {userMiddleware} = require('../middlewares/user')

courseRouter.post("/purchase",userMiddleware,async (req,res)=>{
    const {courseId} = req.body;
    const userId = req.userId;
    const existingPurchase = await purchaseModel.findOne({
        userId,courseId
    })

    if(existingPurchase){
        return res.json({
            msg : "You have already bought this course"
        })
    }

    await purchaseModel.create({
        userId,courseId
    })

    res.json({
        msg : "The course has been bought Successfully"
    })
})

courseRouter.get("/preview",async (req,res)=>{
    const courses = await courseModel.find({});
    
    res.json({
        courses : courses
    })
})

module.exports = {
    courseRouter
}