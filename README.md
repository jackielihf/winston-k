# winston-k

A simple winston transport for kafka. You can easily write log msg to kafka cluster via winston and wiston-k.

# install
npm install winston-k

# usage
## winston-k(options)
*  options.zk - kafka zookeeper connectString
*  options.topic  - kafka topic name
*  options.level -  log level
*  optons.timestamp - timestamp custom function
*  options.formatter - msg formatter


# example
```js
var winston = require('winston');
require('winston-k');
//custom timestamp 
var getTime = function(){
    return new Date().toISOString();
};
//custom formatter
var format = function(options){
    return options.timestamp() + ' [' + options.level.toUpperCase() + '] $ ' + 
    (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? ' ' + JSON.stringify(options.meta) : '' );
};
//add kafka transport to winston
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
```

