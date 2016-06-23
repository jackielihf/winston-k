

var util = require('util');
var winston = require('winston');
var kafka = require('kafka-node');

var common = winston.common;
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;


var KafkaLogger = winston.transports.KafkaLogger = function (options) {
    options = options || {};
    this.init(options);
    //kafka
    this.ok = false;
    this.topic = options.topic;
    if(!this.topic){
        throw new Error('winston-k invalid topic');
    }
    this.zk = options.zk || 'localhost:2181';
    var client = new kafka.Client(this.zk);
    this.producer = new Producer(client);
    this.producer.on('error', function (err) { console.log(err);});
    var that = this;
    this.producer.on('ready', function(){
        that.ok = true;        
    });
};

util.inherits(KafkaLogger, winston.Transport);

KafkaLogger.prototype.init = function(options){
    options = options || {};
    this.name = 'kafka_logger';
    this.level = options.level || 'info';
    if(options.timestamp){
        this.timestamp = options.timestamp;
    }else{
        this.timestamp = function(){return new Date().toISOString()};
    }
    if(options.formatter && typeof options.formatter === 'function'){
        this.formatter = options.formatter;
    }else{
        this.formatter = defaultFormatter;
    }
};

var defaultFormatter = function(options){
    return options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + 
    (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? ' ' + JSON.stringify(options.meta) : '' );
}
  


KafkaLogger.prototype.log = function (level, msg, meta, callback) {

    var options = {}
    options.level = level;
    options.message = msg;
    options.meta = meta;
    options.timestamp = this.timestamp;
    var output = this.formatter(options);
    this.write(output);
    //callback
    callback(null, true);
};


KafkaLogger.prototype.write = function(msg){
    if(!this.producer){
        return;
    }
    if(!msg){
        return;
    }
    if(!this.ok){
        return;
    }
    var payload = [].concat({topic: this.topic, messages: msg});
    this.producer.send(payload, function(err, data){});

}; 

module.exports = KafkaLogger;

