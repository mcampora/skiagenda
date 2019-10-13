// import the sdk
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
global.fetch = require('node-fetch');
const fs = require('fs')

// import the application files
eval(fs.readFileSync('../website/js/authent.js').toString())
eval(fs.readFileSync('../website/js/resa.js').toString())

// define local helpers
var aws = require('aws-sdk');
var CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
var client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-1' });
function cleanupUser(id, next) {
    var params = { Username: id, UserPoolId: 'us-east-1_sI9pmvhIR' }
    console.log('deleteUser(' + id + ') ->')
    client.adminDeleteUser(params,function(err,data){
        if (err) console.log(err)
        else console.log(data)
        next()
    })
}
function confirmUser(id, next) {
    var params = { Username: id, UserPoolId: 'us-east-1_sI9pmvhIR' }
    console.log('confirmUser(' + id + ') ->')
    client.adminConfirmSignUp(params, function(err,data) {
        if (err) console.log(err, err.stack)
        else console.log(data)
        next()
    })
}

// download the modified config file to know the endpoints
const https = require('http')
const options = {
  hostname: 'skiagenda.s3-website-us-east-1.amazonaws.com',
  path: '/js/config.js',
}
const req = https.request(options, res => {
  res.on('data', d => { (0,eval)(d.toString()); test() })
})
req.on('error', error => { console.error(error) })
req.end()

// proceed with the tests
function test() {
    console.log('endpoints:')
    console.log(_config)

    cleanupUser('mcm',function(){
        register('mcm','mcampora@gmail.com','Test#2019',function(){
            confirmUser('mcm',function(){
                signin('mcm','Test#2019',function(){
                    addReservation(accessToken,{resa:{begin:'1',end:'2'}},
                        function(){
                            console.log('sucess!')
                        },
                        function(){
                            console.log('failure!')
                        })
                })
            })
        })
    })
}
