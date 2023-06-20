const {body}=require('express-validator');

const inputsValidation=[
    body('username').notEmpty().escape().withMessage('username is required'),
    body('password').notEmpty().escape().withMessage('password is required'),
];

module.exports=inputsValidation