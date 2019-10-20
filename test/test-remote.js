// import the various sdks
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
global.fetch = require('node-fetch');
const fs = require('fs')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);
const aws = require('aws-sdk');
const https = require('http')

// import the application files
eval(fs.readFileSync('../website/js/authent.js').toString())
eval(fs.readFileSync('../website/js/resa.js').toString())

// define local helpers
var CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
var client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-1' });
function _cleanupUser(id, next) {
    console.log('cleanupUser(' + id + ') ->')
    var params = { Username: id, UserPoolId: _getUserPool().userPoolId }
    //client.adminDeleteUser(params).promise().then(data => console.log(data))
        //.catch(e => console.log(e)
    client.adminDeleteUser(params,function(err,data){
        if (err) { 
            console.log(err)
            next(err)
        }
        else {
            console.log(data)
            next(data)
        }
    })
}
var cleanupUser = id => { return new Promise((resolve) => _cleanupUser(id, resolve)) }

function _confirmUser(id, next) {
    var params = { Username: id, UserPoolId: _getUserPool().userPoolId }
    console.log('confirmUser(' + id + ') ->')
    client.adminConfirmSignUp(params, function(err,data) {
        if (err) {
            console.log(err, err.stack)
            next(err)
        }
        else {
            console.log(data)
            next(data)
        }
    })
}
var confirmUser = id => { return new Promise(resolve => _confirmUser(id, resolve)) }

// download the modified config file to know the endpoints
function _getConfig(onSuccess,onFailure) {
    if (fs.existsSync('localconfig.js')) {

    }
    else {
        const options = {
            hostname: 'skiagenda.s3-website-us-east-1.amazonaws.com',
            path: '/js/config.js',
        }
        const req = https.request(options, res => {
            res.on('data', d => { 
                (0,eval)(d.toString())
                fs.writeFile('localconfig.js', d.toString(), ()=>{})
                onSuccess() 
            })
        })
        req.on('error', error => { onFailure(error) })
        req.end()
    }
}
var getConfig = () => { return new Promise((onfullfilled,onFailure) => _getConfig(onfullfilled,onFailure)) }

// proceed with the tests
// use promise(s) to chain the service and avoid 
// the cascade of asynchroneous callbacks
getConfig()
.then(() => {
    console.log('endpoints:')
    console.log(_config)
    return cleanupUser('mcm')
})
.then(d => {
    console.log('cleanup done!')
    console.log(d)
    return register('mcm','success@simulator.amazonses.com','Test#2019')
})
.then(d => {
    console.log('register done!')
    console.log(d)
    return confirmUser('mcm')
})
.then(d => {
    console.log('confirm done!')
    console.log(d)
    return signin('mcm','Test#2019')
})
.then(d => {
    console.log('signin done!')
    console.log(d)
    return addReservation(accessToken,{resa:{begin:'1',end:'2'}})
})
.then(d => {
    console.log('add done!')
    console.log(d)
    return listReservations(accessToken,{month:'12'})
})
.then(d => console.log(d))
.catch(e => {
   console.log('failure:')
   console.log(e)
})
