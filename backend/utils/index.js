module.exports = {
    status: require('./lib/messages/api.response').status,
    messages: require('./lib/messages/api.response').messages,
    common: require('./lib/common-function'),
    aqiCalculator: require('./aqiCalculator'),
};

