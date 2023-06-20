const nodemailer=require('nodemailer');

const errorMailer= nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:'lodricklowrence@gmail.com',
        pass:''
    }
})

module.exports=errorMailer;