// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    // Log the error (you could replace this with a logging service)
    console.error(err);

    // Set the response status and send a response
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Provide stack trace in dev mode only
    });
};

module.exports = errorHandler;
