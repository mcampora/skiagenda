const AWS = require('aws-sdk')
const Holidays = require('./local_modules/holidays/index.js')
const holidays = new Holidays(AWS)

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
