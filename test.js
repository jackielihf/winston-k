

var winston = require('winston');
var KafkaLogger = require('./logger');

var getTime = function(){
    return new Date().toISOString();
};

var app = 'test';
var format = function(options){
    return options.timestamp() + ' [' + options.level.toUpperCase() + '] (' + app + ') ()$ ' + 
    (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? ' ' + JSON.stringify(options.meta) : '' );
};

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
      level: 'info',
      timestamp: getTime,
      formatter: format
    }),      
      new (winston.transports.KafkaLogger)({topic: 'gfpoint-log', zk: 'localhost:2181', formatter: format})
    ]
  });

//kafka still connecting, will not log
logger.info("test");

setTimeout(function(){ 
    logger.error('hello', {aaa: 1});
}, 3000);




