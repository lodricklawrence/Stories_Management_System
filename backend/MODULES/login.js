const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt=require('bcrypt');
const logger=require('../logger');
const {validationResult}=require('express-validator');
const inputsValidation=require('../inputsValidator');
const jwt=require('jsonwebtoken');

const login=async (req,res)=>{
        try {
            
            await Promise.all(inputsValidation.map(validation=>validation.run(req)));
            const errors=validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
                logger.error(errors)
            }

            const userLogin=await prisma.Users.findUnique({
                where:{
                    username:req.body.username,
                }
            })
            
            const isMatch=bcrypt.compare(req.body.password,userLogin.password);
            if(userLogin.length==0 || !isMatch){
                res.status(400).json({
                    message:"wrong username or password"
                })
            }else{
                const token= await jwt.sign({userLogin},'secretKey',{expiresIn:'2m'});
                res.status(200).json({
                    message:"login successfully",
                    token:token
                })
            }
        } catch (error) {
            logger.error(error);
            // next(error)
        }
    }
    


module.exports = login;