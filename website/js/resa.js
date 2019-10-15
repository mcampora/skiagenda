// ajax call to addReservation API/lambda
// ex. addReservation(accessToken,{resa:{begin:"b",end:"e"}},function(){},function(){})
function _addReservation(token, resa, onSuccess=function(){}, onFailure=function(){}) {
    console.log('addReservation ->')
    console.log(token)
    console.log(resa)
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + '/resa',
        headers: {
            Authorization: token
        },
        data: JSON.stringify(resa),
        contentType: 'application/json',
        success: function(result){
            console.log(result)
            onSuccess(result)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error: ', textStatus, ', Details: ', errorThrown)
            console.error('Response: ', jqXHR.responseText)
            onFailure(jqXHR, textStatus, errorThrown)
        }
    })
}
var addReservation = (token, resa) => { return new Promise((onsuccess,onfailure) => _addReservation(token, resa, onsuccess, onfailure))}

// ajax call to listReservations API/lambda
// ex. listReservations(accessToken,function(){},function(){})
function _listReservations(token, params, onSuccess=function(){}, onFailure=function(){}) {
    console.log('listReservations ->')
    console.log(token)
    console.log(params)
    $.ajax({
        method: 'GET',
        url: _config.api.invokeUrl + '/resa',
        headers: {
            Authorization: token
        },
        data: JSON.stringify(params),
        contentType: 'application/json',
        success: function(result){
            console.log(result)
            onSuccess(result)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error: ', textStatus, ', Details: ', errorThrown)
            console.error('Response: ', jqXHR.responseText)
            onFailure(jqXHR, textStatus, errorThrown)
        }
    })
}
var listReservations = (token, params) => { return new Promise((onsuccess,onfailure) => _listReservations(token, params, onsuccess, onfailure))}
