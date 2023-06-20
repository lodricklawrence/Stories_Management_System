// server modules
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');


// modules for server errors
const expressWinston=require('express-winston');
const logger=require('./logger');
const errorHandler = require('./errorHandler');

// modules for server routes
const register= require('./MODULES/register');
const login = require('./MODULES/login');
const readStoryFile = require('./MODULES/readStoryFile');
const getStoryFiles= require('./MODULES/getStoryFiles');
const Authentication=require('./MODULES/jwtAuthentication');

// server listening port
const PORT=4000;


//middlewares
app.use(bodyParser.json());
app.use(cors());

app.use(expressWinston.logger({
    winstonInstance:logger,
    statusLevels:true
}))


//routes-endpoints
app.post('/register',register);
app.post('/login',login);
app.get('/readFile/:category/:name/:id',Authentication,readStoryFile);
app.get('/getFile/:id',Authentication,getStoryFiles);

app.use(errorHandler);


app.listen(PORT,()=>{
    console.log("server is listening on port"+PORT)
})