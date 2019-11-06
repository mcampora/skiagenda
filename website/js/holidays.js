var refreshHolidays = (token, params) => { return _ajax(token, '/holidays', 'PUT', JSON.stringify(params))}
var listHolidays = (token) => { return _ajax(token, '/holidays', 'GET', {}) }
