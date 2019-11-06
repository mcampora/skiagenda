var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
const Holidays = require('./local_modules/holidays/index.js')
const holidays = new Holidays(AWS)

exports.handler = (event, context, callback) => {
    console.log('Received event: ', event)
    if (!event.requestContext.authorizer) {
      utils.errorResponse('Authorization not configured', context.awsRequestId, callback)
      return
    }
    const requestBody = JSON.parse(event.body)

    // expect to receive 3 ical URLs
    const a_url = requestBody.a
    const b_url = requestBody.b
    const c_url = requestBody.c
    
    holidays.import('A', a_url)
    .then(() => {
        holidays.import('B', b_url)
    })
    .then(() => {
        holidays.import('C', c_url)
    })
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
