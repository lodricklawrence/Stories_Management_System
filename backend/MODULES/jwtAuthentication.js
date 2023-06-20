const jwt =require('jsonwebtoken');

const authentication=(req,res,next)=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(400).json({message:'Authorization token not found'})
    }

    jwt.verify(token,'secretKey',(err,user)=>{
        if(err){
            return res.status(400).json({message:'Invalid token'})
        }

        req.user=user;
        next();
    })

}

module.exports=authentication;