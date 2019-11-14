/*global WildRydes _config AmazonCognitoIdentity AWSCognito*/

(function scopeWrapper($) {

    // register event handlers
    $(function onDocReady() {
        $('#signinForm').submit(handleSignin)
        $('#registrationForm').submit(handleRegister)
        $('#verifyForm').submit(handleVerify)
        $('#logoutLink').click(handleLogout)
    })

    // signout a user
    function handleLogout(event) {
        _getUserPool().getCurrentUser().signOut()
        window.location.href = 'index.html'
    }

    // signin a user
    function handleSignin(event) {
        const email = $('#emailInputSignin').val()
        const password = $('#passwordInputSignin').val()
        event.preventDefault()
        signin(toUsername(email), password)
        .then(d=>{
            console.log('Successfully Logged In',accessToken)
            window.location.href = 'calendar.html'
        })
    }

    // register a new user
    function handleRegister(event) {
        var email = $('#emailInputRegister').val()
        var password = $('#passwordInputRegister').val()
        var password2 = $('#password2InputRegister').val()
        event.preventDefault()
        if (password === password2) {
            register(toUsername(email), email, password)
            .then(d=>{
                console.log(d)
                window.location.href = 'verify.html'
            })
        } else {
            error('Passwords do not match')
        }
    }

    // verify a registration
    function handleVerify(event) {
        var email = $('#emailInputVerify').val()
        var code = $('#codeInputVerify').val()
        event.preventDefault()
        verify(toUsername(email), code)
        .then(result => {
            console.log('call result: ' + result)
            window.location.href = 'index.html'
        })
    }

    // helper, report errors
    const error = (e) => {
        var s = JSON.stringify(e)
        console.log(e)
        alert(s)
    }

    // helper, create a user name based on the provided email adress
    const toUsername = (email) => {
        return email.replace('@', '-at-')
    }

}(jQuery))
