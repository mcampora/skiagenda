var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
AWS.config.update({region: 'us-east-1'}) // Set the region 
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'}) // Create DynamoDB document client
const ical = require('ical')
const Holidays = require('../backend/node_modules/holidays/index.js')
const holidays = new Holidays(ddb, ical)

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    if (!event.requestContext.authorizer) {
      utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
      return
    }
    holidays.list(month)
    .then(d => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(d),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    })
    .catch((err) => {
        console.error(err)
        utils.errorResponse(err.message, context.awsRequestId, callback)
    })
}
