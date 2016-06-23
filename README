# winston-k

A simple winston transport for kafka. You can easily write log msg to kafka cluster via winston and wiston-k.

# usage
## winston-k(options)
options.level -  log level
optons.timestamp - timestamp custom function
options.formatter - msg formatter


# example
var winston = require('winston');
var KafkaLogger = require('winston-k');

var getTime = function(){
    return new Date().toISOString();
};

var format = function(options){
    return options.timestamp() + ' [' + options.level.toUpperCase() + '] $ ' + 
    (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? ' ' + JSON.stringify(options.meta) : '' );
};

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.KafkaLogger)({topic: 'gfpoint-log', zk: 'localhost:2181', formatter: format})
    ]
  });

//kafka still connecting, will not log
logger.info("test");

setTimeout(function(){ 
    logger.error('hello', {aaa: 1});
}, 3000);


