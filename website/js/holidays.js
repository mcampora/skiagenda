var refreshHolidays = (token, params) => { return _ajax(token, '/holidays', 'POST', JSON.stringify(params))}
var listHolidays = (token) => { return _ajax(token, '/holidays', 'GET', {}) }
