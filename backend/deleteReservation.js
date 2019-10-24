const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient();
const utils = require('utils')
const reservations = require('reservations')
const resa = new reservations(ddb)

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    if (!event.requestContext.authorizer) {
      utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
      return
    }
    const requestBody = JSON.parse(event.body)

    const resaowner = event.requestContext.authorizer.claims['cognito:username']
    const resaid = requestBody.resaid
    resa.remove(resaid, resaowner)
    .then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                resaid: resaid,
                resaowner: resaowner
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
    }).catch((err) => {
        console.error(err)
        utils.errorResponse(err.message, context.awsRequestId, callback)
    })
}
