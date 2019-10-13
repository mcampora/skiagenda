// API object
var userPool = null
function getUserPool() {
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
function register(id, email, pwd, next=function(){}) {
    var dataEmail = {
        Name : 'email',
        Value : email
    }
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
    getUserPool().signUp(id, pwd, [attributeEmail], null, function(err, result){
        if (err) {
            console.log("register() ->")
            console.log(err)
        } else {
            user = result.user
            console.log("register() ->")
            console.log(result.user)
            next()
        }
    })
}

// confirm registration
function verify(id, code, next=function(){}) {
    createCognitoUser(id).confirmRegistration(code, true, function(err, result) {
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
function signin(id, pwd, next=function(){}) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: id,
        Password: pwd
    })
    var cognitoUser = createCognitoUser(id)
    console.log("signin() ->")
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            getUserPool().getCurrentUser().getSession(function(e,s){
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

// helper function
function createCognitoUser(email) {
    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: getUserPool()
    })
}
