var crypto = require('crypto');
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.TVM_REGION});
var policy = { "Version":"2012-10-17", "Statement": [ { "Effect": "Allow", "Action": "*", "Resource": "*" } ] }
var tableName = process.env.TVM_TABLE
var dynamodb = new AWS.DynamoDB();
var STS = new AWS.STS();

exports.register = function(deviceID, key, callback) {
  var item = { "device_id": {"S": deviceID}, "key": {"S": key} };
  dynamodb.putItem({TableName:tableName, Item:item}, function(err, data) {
    if (err) return callback(err, null);
    callback(null, data);
  });
};

exports.getToken = function(deviceID, timestamp, signature, callback) {
  dynamodb.getItem({TableName:tableName, Key:{'device_id':{'S':deviceID}}}, function(err, data) {
    if (err) return callback(err, null);
    if (!data.Item) {
      var error = new Error('item not found');
      error.status = 400;
      return callback(error, null);
    }

    var hash = crypto.createHmac('SHA256', data.Item.key.S).update(timestamp).digest('base64');
    if (hash != signature) {
      var error = new Error('signature mismatch');
      error.status = 400;
      return callback(error, null);
    }
    
    STS.getFederationToken({'Name':deviceID,'Policy':JSON.stringify(policy)}, function (err, data) {
      if (err) return callback(err, null);
      callback(null, data);
    });
  });
};
