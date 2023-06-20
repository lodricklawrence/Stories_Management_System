const { transports, format,createLogger } = require('winston');


const logger=createLogger({
    transports:[
        new transports.File({
            level:'warn',
            filename:'./LOGS/logsWarning.log'
        }),

        new transports.File({
            level:'error',
            filename:'./LOGS/logsErrors.log'
        })
    ],

    format:format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    )
})

module.exports=logger