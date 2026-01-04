const { validationResult } = require('express-validator');
const { status } = require('./messages/api.response');
const errorStackParser = require('error-stack-parser');

module.exports = {
    expressValidate(req, res, next) {
        const errors = validationResult(req);
        let errorSort = errors.array({
            onlyFirstError: true,
        });

        if (!errors.isEmpty()) {
            // eslint-disable-next-line no-unused-vars
            let error = errorSort[0];
            return res.status(status.BadRequest).json({ message: error.msg || error, fields: errorSort });
        }
        next();
    },

    /**
     *
     * @param {*} error Error Object.
     * @param {*} APIName - API/Function name where error occurred - will be used if REQ is not available.
     * @param {*} req Request Object (optional).
     * @param {*} res Response Object (optional).
     * @param {*} customMessage Any custom message to send in API response. (optional)
     * @returns return response to client with message.
     */
    throwException(error, APIName, req = null, res = null, customMessage = null) {
        if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
            console.log('multiple errors');
            error.message = error.errors[0].message || error.name;
        }

        if (req) {
            console.error(`Error in ${APIName}, URL: ${req.method} - ${req.url}:`, error.message);
            try {
                const stackTrace = errorStackParser.parse(error);
                console.error(`Stack trace: ${stackTrace[0]?.toString()}`);
            } catch (e) {
                // Ignore stack trace parsing errors
            }
        } else {
            console.error(`Error in ${APIName},`, error.message);
        }

        if (res) {
            return res.status(status.InternalServerError).json({
                message: customMessage ? customMessage : 'Something went wrong, please try again!',
                error: error.message,
            });
        } else {
            return true;
        }
    },
};

