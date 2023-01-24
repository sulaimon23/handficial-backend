import { ResMsg } from "../common/utils";
import log from "../common/utils";

export const errorHandler = (error, req, res, _next) => {
    const { message } = error;

    if (error.code === 11000)
        return ResMsg(res, 400, "error", "Phone number already registered.");

    if (error.response) {
        if (process.env.NODE_ENV === "development") {
            console.log(error);
            log(
                req.method,
                JSON.stringify(error),
                error.response.data.message,
                req.headers,
                req.url
            );
            return ResMsg(
                res,
                error.response.status,
                error.response.data.message
            );
        }

        log(
            req.method,
            JSON.stringify(error),
            error.response.data.message,
            req.headers,
            req.url
        );
        return ResMsg(res, 400, "Something went wrong.");
    }

    if (error.type === "entity.parse.failed") {
        log(req.method, error, message, req.headers, req.url);
        return ResMsg(res, 400, "error", "Invalid JSON payload passed.");
    }
    // error message should be logged here

    // if (process.env.NODE_ENV === 'development') {
    //   // log(req.method, error, message, req.headers, req.url)
    //   console.log(error)
    //   return ResMsg(res, error.status || 500, message)
    // }

    if (error.name === "ValidationError") {
        const errors = {};
        const err = [];
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
            err.push(error.errors[key].message);
        });

        return ResMsg(res, 400, "error", err[0]);
    }

    log(req.method, error, message, req.headers, req.url);

    return ResMsg(res, error.status || 500, "error", message);
};
