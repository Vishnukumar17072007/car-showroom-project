function errorHandler(err, req, res, next) {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || err.statusCode || 500;
    const message =
        status < 500 && err.message
            ? err.message
            : 'Internal server error';

    res.status(status).json({ message });
}

module.exports = errorHandler;
