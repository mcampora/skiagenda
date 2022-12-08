const holidays = require('./holidays')
exports.handler = (event, context, callback) => {
    return holidays.list(event, context, callback);
}
