class AppError extends Error {
    constructor(code, message, statusCode) {
        super(code);
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default AppError;