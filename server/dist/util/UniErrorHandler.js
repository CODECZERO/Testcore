class UniError extends Error {
    constructor(message = "something went wrong", errors = [], stack = "") {
        super(message);
        this.data = message;
        this.message = message ? message : null;
        this.success = false;
        this.errors = errors;
        stack ? this.stack = stack : Error.captureStackTrace(this, this.constructor);
    }
}
export { UniError };
