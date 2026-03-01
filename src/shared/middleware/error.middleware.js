const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            errorCode: err.code,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        errorCode: "INTERNAL_ERROR",
        message: "Internal Server Error"
    });
};

export default errorMiddleware;