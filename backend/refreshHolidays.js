var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
const Holidays = require('./local_modules/holidays/index.js')
const holidays = new Holidays(AWS)
const utils = require('./local_modules/utils/index.js')

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

    console.log("let's start!")
    return holidays.wipe()
    .then(d => {
        console.log('cleanup done!')
        return holidays.import('A', a_url)
    })
    .then(d => {
        console.log('A:', d)
        return holidays.import('B', b_url)
    })
    .then(d => {
        console.log('B:', d)
        return holidays.import('C', c_url)
    })
    .then(d => {
        console.log('C:', d)
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
