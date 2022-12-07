// simulate a browser context
// so we test the API end to end
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);
const aws = require('aws-sdk');
const https = require('http');
if (!localStorage) { 
  var localStorage = { 
      getItem: (k)=>{ return this[k]; },
      setItem: (k,v)=>{ this[k]=v; }
  }; 
}

// import the application files
eval(fs.readFileSync('./src/client/config.js').toString());
eval(fs.readFileSync('./src/client/authent.js').toString());
eval(fs.readFileSync('./src/client/services.js').toString());

// constants
const REMOTE_A_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-A.ics"
const REMOTE_B_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-B.ics"
const REMOTE_C_SRC="https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-C.ics"

// the test suite
describe("Test Holidays API -", function() {

    it("fetch client config", function() {
        expect(_config).not.toBe(null)
        expect(_config.api.invokeUrl).not.toBe(null)
    })

    it("clean up the test user", function() {
      return cleanupUser('mcm').then(() => {
        expect(true).toBe(true)
      })
    })

    it("register the test user", function() {
      return register('mcm','success@simulator.amazonses.com','Test#2019').then((d) => {
        expect(d).not.toBe(null)
        expect(d.user.username).toBe('mcm')
      })
    })

    it("verify the test user", function() {
      return confirmUser('mcm').then((d) => {
        expect(true).toBe(true)
      })
    })

    it("sign the test user", function() {
      return signin('mcm','Test#2019').then((d) => {
        expect(accessToken).not.toBe(null)
      })
    })

    it("refresh holidays", function() {
      return refreshHolidays(accessToken, {
        a: REMOTE_A_SRC,
        b: REMOTE_B_SRC,
        c: REMOTE_C_SRC
      })
      .then(d => {
          //console.log(d)
          //expect(d).toEqual([])
      })
    })

    it("retrieve the list of holidays", function() {
      return listHolidays(accessToken).then((d) => {
        //console.log(d)
        expect(d.Count).toBe(24)
      })
    })

})

// define local helpers
var CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
var client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region: 'us-east-1' });
function _cleanupUser(id, next) {
    //console.log('cleanupUser(' + id + ') ->')
    var params = { Username: id, UserPoolId: _getUserPool().userPoolId }
    client.adminDeleteUser(params,function(err,data){
        if (err) { 
            //console.log(err)
            next(err)
        }
        else {
            //console.log(data)
            next(data)
        }
    })
}
var cleanupUser = id => { return new Promise((resolve) => _cleanupUser(id, resolve)) }

function _confirmUser(id, next) {
    var params = { Username: id, UserPoolId: _getUserPool().userPoolId }
    //console.log('confirmUser(' + id + ') ->')
    client.adminConfirmSignUp(params, function(err,data) {
        if (err) {
            //console.log(err, err.stack)
            next(err)
        }
        else {
            //console.log(data)
            next(data)
        }
    })
}
var confirmUser = id => { return new Promise(resolve => _confirmUser(id, resolve)) }


