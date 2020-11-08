
class Responses {
    static successResponse(success, result, message, res) {
        res.send({
            success,
            message,
            result
        });

    }

    static errorResponse(success, message, statusCode, res) {
        res.status(statusCode).send({
            success,
            message,
        });
    }
}

module.exports = {
    successResponse: Responses.successResponse,
    errorResponse: Responses.errorResponse,
};
