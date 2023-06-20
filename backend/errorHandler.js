const logger=require('./logger');
const errorMailer=require('./mailer');

const errorHandler=async (err,req,res,next)=>{
    
    try {
        await errorMailer.sendMail({
            from: 'lodricklowrence@gmail.com',
            to:  'lodricklowrence@gmail.com',
            subject: 'STORIES MANAGEMENT SYSTEM',
            html: "<h3>There was an error in STORIES_MS REST API</h3>",
            html:"<p>'There was an error in STORIES_MS REST API'</p>"
        })
        logger.error(`message sent: ${mailSend.messageId}`)
       
    } catch (error) {
        logger.error(error)
    }
    res.status(500).json({ error: 'Sorry, there was an internal server error. Please try again.' });
    next()
   
}

module.exports=errorHandler;