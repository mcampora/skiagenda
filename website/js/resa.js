// ajax call to addReservation API/lambda
// ex. addReservation(accessToken,{resa:{begin:"b",end:"e"}},function(){},function(){})
var rsc = 'resa';
function addReservation(token, resa, onSuccess, onFailure) {
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + '/' + rsc,
        headers: {
            Authorization: token
        },
        data: JSON.stringify(resa),
        contentType: 'application/json',
        success: function(result){
            console.log(result);
            onSuccess(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error: ', textStatus, ', Details: ', errorThrown);
            console.error('Response: ', jqXHR.responseText);
            onFailure(jqXHR, textStatus, errorThrown);
        }
    });
}
