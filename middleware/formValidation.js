
const validation = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const errorDetails = error.errors.map((err) => ({
            field: err.path[0],
            message: err.message
        }));
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errorDetails
        });
    }
};

module.exports = validation;