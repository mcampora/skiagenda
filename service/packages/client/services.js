// ajax help[er for reservation APIs/lambdas
function _ajax(token, rsc, method, params) {
  //console.log(_config.api.invokeUrl)
  //console.log(rsc + '/' + method + ' ->')
  //console.log(token)
  //console.log(params)
  return $.ajax({
      method: method,
      url: _config.api.invokeUrl + rsc,
      headers: { Authorization: token },
      data: params,
      contentType: 'application/json'
  }).promise();
}

var addReservation = (token, params) => { return _ajax(token, '/resa', 'POST', JSON.stringify(params))};
var listReservations = (token, params) => { return _ajax(token, '/resa', 'GET', params)};
var updateReservation = (token, params) => { return _ajax(token, '/resa', 'PUT', JSON.stringify(params))};
var deleteReservation = (token, params) => { return _ajax(token, '/resa', 'DELETE', JSON.stringify(params))};

var refreshHolidays = (token, params) => { return _ajax(token, '/holidays', 'PUT', JSON.stringify(params))};
var listHolidays = (token) => { return _ajax(token, '/holidays', 'GET', {}) };
