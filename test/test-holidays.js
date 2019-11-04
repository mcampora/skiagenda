var AWS = require('aws-sdk') // Load the AWS SDK for Node.js
AWS.config.update({region: 'us-east-1'}) // Set the region 
var ddb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'}) // Create DynamoDB document client
const ical = require('ical')
const Holidays = require('../backend/node_modules/holidays/index.js')
const holidays = new Holidays(ddb, ical)

holidays.wipe()
.then(d => {
    console.log(d)
    return holidays.import('A', 'https://www.data.gouv.fr/en/datasets/r/b580138b-ae5c-4b4d-8cbf-110ffd373192')
})
.then(d => {
    console.log(d)
    return holidays.list()
})
.then(d => {
    console.log(d)
})
.catch(e => {
    console.log(e)
})
