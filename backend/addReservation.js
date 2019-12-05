const AWS = require('aws-sdk')
const randomBytes = require('crypto').randomBytes
const utils = require('./local_modules/utils/index.js')
const reservations = require('./local_modules/reservations/index.js')
const resa = new reservations(AWS)

// addReservation lambda function
    exports.handler = (event, context, callback) => {
        console.log('Received event: ', event)
        if (!event.requestContext.authorizer) {
        utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
        return
        }
        const request = JSON.parse(event.body)
        const username = event.requestContext.authorizer.claims['cognito:username']
        const params = request.resa
        params.resaid = toUrlString(randomBytes(16))
        params.resaowner = username
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
