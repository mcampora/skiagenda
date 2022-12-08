const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'}) // Set the region, could use AWS_DEFAULT_REGION variable

const Holidays = require('schoolholidays-db')
const holidays = new Holidays(AWS)
const utils = require('utils')

exports.list = (event, context, callback) => {
    console.log('Received list event: ', event);
    if (!event?.requestContext?.authorizer) {
      utils.errorResponse('Authorization not configured', context?.awsRequestId, callback);
      return;
    }

    //console.log("let's start!");
    return holidays.list()
    .then(d => {
        console.log('got the list: ' + d);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify(d),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    })
    .catch((err) => {
        console.log('Error: ' + err);
        return utils.errorResponse(err.message, context?.awsRequestId, callback);
    })
}

exports.refresh = (event, context, callback) => {
    console.log('Received refresh event: ', event);
    if (!event?.requestContext?.authorizer) {
      utils.errorResponse('Authorization not configured', context?.awsRequestId, callback);
      return;
    }
    const requestBody = JSON.parse(event.body);

    // expect to receive 3 ical URLs
    const a_url = requestBody.a;
    const b_url = requestBody.b;
    const c_url = requestBody.c;

    //console.log("let's start!");
    return holidays.wipe()
    .then(async d => {
        //console.log('cleanup done!');
        return await holidays.importFromURL('A', a_url);
    })
    .then(async d => {
        //console.log('A done!');
        return await holidays.importFromURL('B', b_url);
    })
    .then(async d => {
        //console.log('B done!');
        return await holidays.importFromURL('C', c_url);
    })
    .then(d => {
        //console.log('C done!');
        return callback(null, {
            statusCode: 201,
            body: JSON.stringify(d),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    })
    .catch((err) => {
        console.error(err);
        return utils.errorResponse(err.message, context?.awsRequestId, callback);
    })
}
