// ajax help[er for reservation APIs/lambdas
function _reservation(token, name, method, params, onSuccess=function(){}, onFailure=function(){}) {
    //console.log(name + ' ->')
    //console.log(token)
    //console.log(params)
    //console.log(params)
    $.ajax({
        method: method,
        url: _config.api.invokeUrl + '/resa',
        headers: {
            Authorization: token
        },
        data: JSON.stringify(params),
        contentType: 'application/json',
        success: function(result){
            //console.log(result)
            onSuccess(result)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.error('Error: ', textStatus, ', Details: ', errorThrown)
            //console.error('Response: ', jqXHR.responseText)
            onFailure(jqXHR, textStatus, errorThrown)
        }
    })
}
var addReservation = 
    (token, params) => 
        { return new Promise((onsuccess,onfailure) => 
            _reservation(token, 'addReservation', 'POST', params, onsuccess, onfailure))}
var listReservations = 
    (token, params) => 
        { return new Promise((onsuccess,onfailure) => 
            _reservation(token, 'listReservations', 'GET', params, onsuccess, onfailure))}
var updateReservation = 
    (token, params) => 
        { return new Promise((onsuccess,onfailure) => 
            _reservation(token, 'updateReservation', 'PUT', params, onsuccess, onfailure))}
var deleteReservation = 
    (token, params) => 
        { return new Promise((onsuccess,onfailure) => 
            _reservation(token, 'deleteReservation', 'DELETE', params, onsuccess, onfailure))}
                