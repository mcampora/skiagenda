const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'}) // Set the region, could use AWS_DEFAULT_REGION variable
const randomBytes = require('crypto').randomBytes;
const reservations = require('./reservations-db');
const resa = new reservations(AWS);

const errorResponse = (errorMessage, awsRequestId, callback) => {
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: errorMessage,
        Reference: awsRequestId,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
}

// addReservation lambda function
exports.add = (event, context, callback) => {
    //console.log('Received add event: ', event);
    if (!event?.requestContext?.authorizer) {
        return errorResponse('Authorization not configured', context?.awsRequestId, callback);
    }
    const request = JSON.parse(event.body);
    const username = event?.requestContext?.authorizer?.claims['cognito:username'];
    const params = request?.resa;
    params.resaid = toUrlString(randomBytes(16));
    params.resaowner = username;
    return resa.create(params)
    .then(d => {
        return callback(null, {
            statusCode: 201,
            body: JSON.stringify(params),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    })
    .catch((err) => {
        console.error(err);
        return errorResponse(err?.message, context?.awsRequestId, callback);
    })
}

const toUrlString = (buffer) => {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

exports.delete = (event, context, callback) => {
    //console.log('Received delete event: ', event);
    if (!event?.requestContext?.authorizer) {
      return errorResponse('Authorization not configured', context?.awsRequestId, callback);
    }
    const requestBody = JSON.parse(event.body);

    const resaowner = event?.requestContext?.authorizer?.claims['cognito:username'];
    const resaid = requestBody?.resaid;
    return resa.remove(resaid, resaowner)
    .then(() => {
        return callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                resaid: resaid,
                resaowner: resaowner
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    }).catch((err) => {
        console.error(err);
        return errorResponse(err?.message, context?.awsRequestId, callback);
    })
}

exports.list = (event, context, callback) => {
    //console.log('Received list event: ', event);
    if (!event?.requestContext?.authorizer) {
      return errorResponse('Authorization not configured', context?.awsRequestId, callback);
    }
    let month = event?.queryStringParameters?.month;
    if (!month) {
        month = new Date().toISOString();
    }
    //console.log('let\'s list the resas!');
    return resa.list(month)
    .then(d => {
        //console.log(d);
        return callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                Date: month,
                Reservations: d
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    })
    .catch((err) => {
        console.error(err);
        return errorResponse(err.message, context.awsRequestId, callback);
    })
}

exports.update = (event, context, callback) => {
    //console.log('Received update event: ', event);
    if (!event?.requestContext?.authorizer) {
      return errorResponse('Authorization not configured', context.awsRequestId, callback);
    }
    const requestBody = JSON.parse(event?.body);
    const params = requestBody?.resa;
    params.resaowner = event?.requestContext?.authorizer?.claims['cognito:username'];
    return resa.update(params)
    .then(() => {
        return callback(null, {
            statusCode: 201,
            body: JSON.stringify(params),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    })
    .catch((err) => {
        console.error(err);
        return errorResponse(err?.message, context?.awsRequestId, callback);
    })
}
