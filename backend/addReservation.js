const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const randomBytes = require('crypto').randomBytes
const utils = require('utils')
const reservations = require('reservations')
const resa = new reservations(ddb)

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    if (!event.requestContext.authorizer) {
      utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
      return
    }
    const request = JSON.parse(event.body)
    const username = event.requestContext.authorizer.claims['cognito:username']
    const params = {
        resaid : toUrlString(randomBytes(16)),
        firstday : request.resa.firstday,
        lastday : request.resa.lastday,
        resaowner : username
    }
    return resa.create(params)
    .then(d => {
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

const toUrlString = (buffer) => {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}
