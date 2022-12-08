const holidays = require('./holidays')
exports.handler = (event, context, callback) => {
    return holidays.refresh(event, context, callback);
}