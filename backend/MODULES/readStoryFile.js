const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs=require('fs');
const path = require('path');
const logger=require('../logger');

const readStoryFile=async (req,res,next)=>{
    const userId=Number(req.params.id);
    const storyCategory=req.params.category ;
    const storyName=req.params.name;
    const storiesDirectory='../STORIES';
    const storyPath=path.join(__dirname,storiesDirectory,storyCategory,storyName);

    await fs.readFile(storyPath, 'utf-8',(err,data)=>{
       
        if(err){
            logger.error(err)
            next(err)
        }else{
            res.json(data)
        }
    })

    const findUser=await prisma.viewHistory.findMany({
        where:{
            userId:userId,
            storyCategory:storyCategory

        }
    })

    if(findUser.length===0){
        try {
            const addUser=await prisma.viewHistory.create({
                data:{
                    storyCategory:storyCategory,
                    noOfreads:Number(1),
                    userId:userId
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }else{
        try {
            const userID=findUser[0].id;
            const userReads=findUser[0].noOfreads;
            const updateViewHistory=await prisma.viewHistory.update({
                where:{
                    id:userID
                },
                data:{
                    noOfreads:userReads+1
                }
            })

        } catch (error) {
            logger.error(error)
            // next(error)
        }
    }

}

module.exports= readStoryFile;