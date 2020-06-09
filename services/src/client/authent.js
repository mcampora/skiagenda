// TBD PUT BACK IN PLACE THE LOCALSTORAGE

// API object
var userPool = null;
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
function _register(id, email, pwd, onSuccess, onFailure) {
    var dataEmail = { Name : 'email', Value : email }
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
    //console.log('register() ->')
    _getUserPool().signUp(id, pwd, [attributeEmail], null, (err, result) => {
        if (err) {
            //console.log(err)
            onFailure(err)
        } else { 
            user = result.user
            //console.log(result.user)
            onSuccess(result)
        }
    })
}
var register = (id, email, pwd) => { return new Promise((resolve, reject) => _register(id, email, pwd, resolve, reject)) }

// confirm registration
function _verify(id, code, onSuccess, onFailure) {
    //console.log('_verify() ->')
    _createCognitoUser(id).confirmRegistration(code, true, (err, result) => {
        if (err) {
            //console.log(err)
            onFailure(err)
        } else {
            //console.log(result)
            onSuccess(result)
        }
    })
}
var verify = (id, code) => { return new Promise((resolve, reject) => _verify(id, code, resolve, reject))}

// signin
// ex. signin('mcm','Test#2019')
var accessToken = null;
accessToken = localStorage.getItem("accessToken")
function _signin(id, pwd, onSuccess, onFailure) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: id,
        Password: pwd
    })
    var cognitoUser = _createCognitoUser(id)
    //console.log("signin() ->",cognitoUser)
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            _getUserPool().getCurrentUser().getSession(function(e,s){
                accessToken = s.getIdToken().getJwtToken()
                localStorage.setItem("accessToken", accessToken)
                //console.log(result)
                onSuccess(result)
            });
        },
        onFailure: onFailure
    })
}
var signin = (id, pwd) => { return new Promise((resolve, reject) => _signin(id, pwd, resolve, reject))}

// helper function
function _createCognitoUser(id) {
    return new AmazonCognitoIdentity.CognitoUser({
        Username: id,
        Pool: _getUserPool()
    })
}
