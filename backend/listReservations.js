const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const utils = require('utils')
const reservations = require('reservations')
const resa = new reservations(ddb)

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    if (!event.requestContext.authorizer) {
      utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
      return
    }
    var month = event.queryStringParameters.month
    if (!month) {
        month = new Date().toISOString()
    }
    resa.list(month)
    .then(d => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                Date: month,
                Reservations: d
            }),
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
