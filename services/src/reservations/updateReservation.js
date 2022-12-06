const AWS = require('aws-sdk')
const utils = require('utils')
const reservations = require('reservations-db')
const resa = new reservations(AWS)

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    //if (!event.requestContext.authorizer) {
      //utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
      //return
    //}
    const requestBody = JSON.parse(event.body)

    const params = requestBody.resa
    params.resaowner = event.requestContext.authorizer.claims['cognito:username']
    resa.update(params)
    .then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(params),
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
