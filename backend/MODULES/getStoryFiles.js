const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs=require('fs');
const path = require('path');
const logger=require('../logger');


const getStoryFiles = async (req,res,next)=>{
    const userId=Number(req.params.id);
    const storiesDirectory='../STORIES'
    const findUser=await prisma.viewHistory.findMany({
        where:{
            userId:userId,        

        },
        orderBy:{
            noOfreads:'desc'
        }
    })

    if(findUser.length!==0){
        try {
            const storyCategory=findUser[0].storyCategory;
            const storypath=path.join(__dirname,storiesDirectory,storyCategory) ;

            fs.readdir(storypath,(err,files)=>{
                if(err){
                   logger.error(err)
                   next(err)
                }else{
                    let allFiles=[{files:files,category:storyCategory}];
                    const storypath2=path.join(__dirname,storiesDirectory);
                    fs.readdir(storypath2,(err,files)=>{
                        if(err){
                            logger.error(err)
                            next(err)
                        }else{
                            const list=files;
                            const newList=list.filter(item=>item!==storyCategory)
                            for (let storiesDir of newList) {
                                const dirPath = path.join(__dirname, storiesDirectory, storiesDir);
                                const dirFiles = fs.readdirSync(dirPath);
                                
                                allFiles = allFiles.concat({files:dirFiles,category:storiesDir});
                              }
                            res.send(allFiles)
                        }
                    })
                    
                }
            }) 
            

        } catch (error) {
          logger.error(error) 
        //   next(error)
        }

    }else{
        try {
            const allCategories=path.join(__dirname,storiesDirectory);
            
            fs.readdir(allCategories,(err,files)=>{
                if(err){
                    logger.error(err)
                    next(err)
                }else{
                  const filesInallCategories=files
                  let allFiles=[]
                  for(fileCategory of filesInallCategories){
                    const categoryPath=path.join(__dirname,storiesDirectory,fileCategory)
                    const files=fs.readdirSync(categoryPath)
                    allFiles=allFiles.concat({files:files,category:fileCategory})
                  }

                res.send(allFiles)               }
            })

        } catch (error) {
            logger.error(error)
            // next(error)
        }
    }
}

module.exports = getStoryFiles;

