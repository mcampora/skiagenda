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

if (!localStorage) { 
  var localStorage = { 
      getItem: (k)=>{ return this[k]; },
      setItem: (k,v)=>{ this[k]=v; }
  }; 
}

// import the application files
eval(fs.readFileSync('../src/client/config.js').toString());
eval(fs.readFileSync('../src/client/authent.js').toString());
eval(fs.readFileSync('../src/client/services.js').toString());

//
// the test suite
//
describe("Test Resa API -", function() {

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

    var gresaid = null
    it("create a basic reservation", function() {
      const firstday = '2013-01-07 10:00'
      const lastday = '2013-01-14 10:00' 
      return addReservation(accessToken,{resa:{firstday:firstday,lastday:lastday}})
      .then((d) => {
        expect(d.resaid).not.toBe(null)
        expect(d.resaowner).toBe('mcm')
        expect(d.firstday).toBe(firstday)
        expect(d.lastday).toBe(lastday)
        // save the resaid
        gresaid = d.resaid
      })
      .catch(e => {
        console.log(e)
        fail()
      })
    })

    var nbresa = 0
    it("retrieve the list of reservations, full list", function() {
      return listReservations(accessToken,"month=2013-01-10 10:00").then((d) => {
        //console.log(d)
        expect(d.Reservations.Items.length).toBeGreaterThan(0)
        nbresa = d.Reservations.Items.length
      })
    })

    it("retrieve the list of reservations, empty list", function() {
      return listReservations(accessToken,"month=2013-06-10 10:00").then((d) => {
        //console.log(d)
        expect(d.Reservations.Items.length).toBe(0)
      })
    })

    it("update the reservation, no overlap", function() {
      const firstday = '2013-01-08 10:00'
      const lastday = '2013-01-10 10:00' 
      //const firstday = '2013-01-15 10:00'
      //const lastday = '2013-01-20 10:00' 
      const resa = {resa:{resaid:gresaid,firstday:firstday,lastday:lastday,note:'',category:'rental',revenue:600}}
      return updateReservation(accessToken,resa)
      .then(d => {
        //console.log(d)
        expect(d.resaid).toBe(gresaid)
        expect(d.resaowner).toBe('mcm')
        expect(d.firstday).toBe(firstday)
        expect(d.lastday).toBe(lastday)
      })
      .catch(e => {
        console.log(resa)
        console.log(e)
        fail()
      })
    })

    it("delete the reservation", function() {
      return deleteReservation(accessToken,{resaid:gresaid})
      .then(d => {
        //console.log(d)
        expect(d).not.toBe(null)
      })
      .catch(e => {
        console.log(e)
        fail()
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

