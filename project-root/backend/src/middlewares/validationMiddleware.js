const { body, query, param } = require('express-validator');

class ValidationMiddleware {
    static validateApplicationCreation() {
        return [
            body('endpoint_id').notEmpty().withMessage('Endpoint ID is required').isUUID(),
            body('name').notEmpty().withMessage('Application name is required').isString(),
            body('status').notEmpty().withMessage('Status is required').isIn(['allowed', 'blocked'])
        ];
    }

    static validateApplicationRemoval() {
        return [param('id').notEmpty().withMessage('Application ID is required').isUUID()];
    }
}

module.exports = ValidationMiddleware;
