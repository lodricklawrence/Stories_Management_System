const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt=require('bcrypt');
const logger=require('../logger');
const {validationResult,matchedData}=require('express-validator');
const inputsValidation=require('../inputsValidator');

const register =async(req,res,next)=>{
        try {
            await Promise.all(inputsValidation.map(validation=>validation.run(req)));
            const errors=validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
                logger.error(errors)
            }
            const data=matchedData(req);
            const isPresent=await prisma.Users.findUnique({
                where:{
                    username:data.username,
                }
            })
            if(isPresent){
                res.json({
                    message:"username is already taken"
                })
            }else{
            const salt=await bcrypt.genSalt(10);
            let password=data.password;
            if(typeof(password)==='number'){
                const passwordString = password.toString();
                password=passwordString;
            }
            const hashedPassword = await bcrypt.hash(password, salt);
            const registerUser=await prisma.Users.create({
                data:{
                    username:data.username,
                    password:hashedPassword 
                }
            })
            res.status(200).json({
                message:"registration is successfull",
                user:registerUser
            })
        }

        } catch (error) {
            res.status(500).json({
                message:"failed to register"
            })
            logger.error(error)
            // next(error)
        } 
    }


module.exports = register;