// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// create a record
var params = {
    TableName: 'Reservations',
    Item: {
      'resaid'      : 'myspecialid',
      'firstday'    : '10DEC2019 12:00',
      'lastday'     : '17DEC2019 12:00',
      'resaowner'   : 'marco',
      'creationtime': new Date().toISOString()
    }
}
docClient.put(params).promise()
.then(d=>{
    console.log("Created the item successfully!")
    console.log(d)
    // retrieve the record
    params = {
        TableName: 'Reservations',
        Key: { 'resaid' : 'myspecialid' }
    }
    return docClient.get(params).promise()
})
.then(d=>{
    console.log("Retrieved the item successfully!")
    console.log(d)
    // scan the records
    params = { TableName : "Reservations" }
    return docClient.scan(params).promise()
})
.then(d=>{
    console.log("Scaned the items successfully!")
    console.log(d)
    // update the record
    params = {
        TableName: 'Reservations',
        Key: { 'resaid' : 'myspecialid' },
        UpdateExpression: 'set lastday = :e, updateTime = :t',
        ConditionExpression: 'resaowner = :o',
        ExpressionAttributeValues: {
            ':e' : '17JAN2019 12:00',
            ':t' : new Date().toISOString(),
            ':o' : 'marco'
        }
    }
    return docClient.update(params).promise()
})
.then(d=>{
    console.log("Updated successfully my record!")
    console.log(d)
    // delete the record
    params = {
        TableName: 'Reservations',
        Key: { 'resaid' : 'myspecialid' },
        ConditionExpression: 'resaowner = :o',
        ExpressionAttributeValues: {
            ':o' : 'marco'
        }
    }
    return docClient.delete(params).promise()
})
.then(d=>{
    console.log("Deleted successfully my record!")
    console.log(d)
})
.catch(e=>{
    console.log("Error", e)
})
