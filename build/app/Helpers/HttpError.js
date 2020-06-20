"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(code, status, message) {
        super(JSON.stringify({ code, status, message, error: true }));
        Object.setPrototypeOf(this, this.constructor.prototype);
    }
    static handle(req, res, err) {
        if (err instanceof this) {
            const error = JSON.parse(err.message);
            console.error(error);
            return res.status(error.code).send(error);
        }
        console.error(err);
        return res.status(500).send({
            code: 500,
            status: 'Internal server error!',
            message: `An error occured in server while ${req.method.toUpperCase()} '${req.url}'!`,
            error: true
        });
    }
}
exports.default = HttpError;
