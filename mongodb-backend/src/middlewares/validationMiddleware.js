/**
 * Middleware for request validation
 * @param {Function} validator - Validation function that returns errors if any
 */
const validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    next();
  };
};

module.exports = validate;
