// API object
var userPool = null
function _getUserPool() {
    if (userPool == null) {
        var poolData = {
            UserPoolId : _config.cognito.userPoolId,
            ClientId : _config.cognito.userPoolClientId
        }
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
    }
    return userPool
}

// register
var user = null;
function _register(id, email, pwd, onSuccess=function(){}, onFailure=function(){}) {
    var dataEmail = { Name : 'email', Value : email }
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
    console.log("register() ->")
    _getUserPool().signUp(id, pwd, [attributeEmail], null, function(err, result){
        if (err) {
            console.log(err)
            onFailure(err)
        }
        else { 
            user = result.user
            console.log(result.user)
            onSuccess(result)
        }
    })
}
var register = (id, email, pwd) => { return new Promise(resolve => _register(id, email, pwd, resolve))}

// confirm registration
function _verify(id, code, next=function(){}) {
    _createCognitoUser(id).confirmRegistration(code, true, function(err, result) {
        console.log('adminConfirm() ->')
        if (err) {
            console.log(err)
        } else {
            console.log(result)
            next()
        }
    })
}

// signin
// ex. signin('mcm','Test#2019')
var accessToken = null;
function _signin(id, pwd, next=function(){}) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: id,
        Password: pwd
    })
    var cognitoUser = _createCognitoUser(id)
    console.log("signin() ->")
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            _getUserPool().getCurrentUser().getSession(function(e,s){
                accessToken = s.getIdToken().getJwtToken()
                console.log(result)
                next()
            });
        },
        onFailure: function(err) {
            console.log(err)
        }
    })
}
var signin = (id, pwd) => { return new Promise(resolve => _signin(id, pwd, resolve))}

// helper function
function _createCognitoUser(email) {
    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: _getUserPool()
    })
}
