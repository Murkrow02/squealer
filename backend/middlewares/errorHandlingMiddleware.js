const errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({ message: 'Internal server error', error: err.message });
};

module.exports = errorHandlingMiddleware;
