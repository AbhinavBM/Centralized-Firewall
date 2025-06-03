const Joi = require('joi');

/**
 * Validation schema for firewall rule creation
 */
const createFirewallRuleSchema = Joi.object({
  // Required fields
  action: Joi.string()
    .valid('allow', 'deny', 'ALLOW', 'DENY')
    .required()
    .messages({
      'any.required': 'Action is required',
      'any.only': 'Action must be either allow or deny'
    }),

  // Optional identification fields
  name: Joi.string().trim().max(255).optional(),
  description: Joi.string().trim().max(1000).optional(),

  // Optional reference fields
  endpointId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Endpoint ID must be a valid MongoDB ObjectId'
    }),
  
  applicationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Application ID must be a valid MongoDB ObjectId'
    }),

  processName: Joi.string().trim().max(255).optional(),

  // NGFW fields
  entity_type: Joi.string()
    .valid('ip', 'domain')
    .default('ip')
    .optional(),

  // IP-based rule fields
  source_ip: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .optional()
    .when('entity_type', {
      is: 'ip',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),

  destination_ip: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .optional()
    .when('entity_type', {
      is: 'ip',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),

  source_port: Joi.number()
    .integer()
    .min(0)
    .max(65535)
    .optional()
    .when('entity_type', {
      is: 'ip',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),

  destination_port: Joi.number()
    .integer()
    .min(0)
    .max(65535)
    .optional()
    .when('entity_type', {
      is: 'ip',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),

  // Domain-based rule fields
  domain_name: Joi.string()
    .domain()
    .optional()
    .when('entity_type', {
      is: 'domain',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    }),

  // Legacy fields for backward compatibility
  entityType: Joi.string().valid('ip', 'domain').optional(),
  domain: Joi.string().domain().optional(),
  sourceIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  destinationIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  sourcePort: Joi.number().integer().min(0).max(65535).optional(),
  destinationPort: Joi.number().integer().min(0).max(65535).optional(),

  // Other fields
  protocol: Joi.string()
    .valid('TCP', 'UDP', 'ICMP', 'ANY')
    .default('ANY')
    .optional(),

  priority: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional(),

  enabled: Joi.boolean()
    .default(true)
    .optional()
});

/**
 * Validation schema for firewall rule update
 */
const updateFirewallRuleSchema = Joi.object({
  // All fields are optional for updates
  action: Joi.string()
    .valid('allow', 'deny', 'ALLOW', 'DENY')
    .optional(),

  name: Joi.string().trim().max(255).optional(),
  description: Joi.string().trim().max(1000).optional(),

  endpointId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
  
  applicationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  processName: Joi.string().trim().max(255).optional(),

  entity_type: Joi.string().valid('ip', 'domain').optional(),
  source_ip: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  destination_ip: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  source_port: Joi.number().integer().min(0).max(65535).optional(),
  destination_port: Joi.number().integer().min(0).max(65535).optional(),
  domain_name: Joi.string().domain().optional(),

  // Legacy fields
  entityType: Joi.string().valid('ip', 'domain').optional(),
  domain: Joi.string().domain().optional(),
  sourceIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  destinationIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
  sourcePort: Joi.number().integer().min(0).max(65535).optional(),
  destinationPort: Joi.number().integer().min(0).max(65535).optional(),

  protocol: Joi.string().valid('TCP', 'UDP', 'ICMP', 'ANY').optional(),
  priority: Joi.number().integer().min(0).optional(),
  enabled: Joi.boolean().optional()
});

/**
 * Middleware to validate firewall rule creation
 */
const validateCreateFirewallRule = (req, res, next) => {
  const { error, value } = createFirewallRuleSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const messages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    });
  }

  // Replace request body with validated and sanitized data
  req.body = value;
  next();
};

/**
 * Middleware to validate firewall rule update
 */
const validateUpdateFirewallRule = (req, res, next) => {
  const { error, value } = updateFirewallRuleSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const messages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages
    });
  }

  // Replace request body with validated and sanitized data
  req.body = value;
  next();
};

/**
 * Custom validation for business logic
 */
const validateFirewallRuleBusinessLogic = (req, res, next) => {
  const { entity_type, source_ip, destination_ip, domain_name, processName, endpointId, applicationId } = req.body;

  // For IP-based rules, at least one IP field should be provided
  if (entity_type === 'ip') {
    if (!source_ip && !destination_ip) {
      return res.status(400).json({
        success: false,
        message: 'For IP-based rules, at least source IP or destination IP must be provided'
      });
    }
  }

  // For domain-based rules, domain name is required
  if (entity_type === 'domain' && !domain_name) {
    return res.status(400).json({
      success: false,
      message: 'Domain name is required for domain-based rules'
    });
  }

  // For process-based rules, ensure we have either endpointId or applicationId
  if (processName && !endpointId && !applicationId) {
    return res.status(400).json({
      success: false,
      message: 'Process-based rules require either an endpoint or application'
    });
  }

  next();
};

module.exports = {
  validateCreateFirewallRule,
  validateUpdateFirewallRule,
  validateFirewallRuleBusinessLogic,
  createFirewallRuleSchema,
  updateFirewallRuleSchema
};
