const { Op } = require('sequelize');
const Endpoint = require('../models/Endpoint');
const Application = require('../models/Application');
const EndpointApplicationMapping = require('../models/EndpointApplicationMapping');
const { v4: uuidv4 } = require('uuid');

// Create a new mapping with conditional status
const createMapping = async (req, res) => {
  try {
    const { endpoint_id, application_id } = req.body;

    // Basic input validation for endpoint_id and application_id
    if (!endpoint_id || !application_id) {
      return res.status(400).json({ error: 'endpoint_id and application_id are required' });
    }

    // Ensure endpoint_id and application_id are UUIDs
    if (!uuidv4().test(endpoint_id) || !uuidv4().test(application_id)) {
      return res.status(400).json({ error: 'Invalid UUID format for endpoint_id or application_id' });
    }

    // Get the endpoint and application details to determine the status
    const endpoint = await Endpoint.findByPk(endpoint_id);
    const application = await Application.findByPk(application_id);

    if (!endpoint || !application) {
      return res.status(404).json({ error: 'Endpoint or Application not found' });
    }

    // Define the conditional status logic
    let status = 'Active'; // Default status
    if (endpoint.hostname === 'server-05' && application.name === 'Web Application A') {
      status = 'Inactive';
    }

    // Use findOrCreate to avoid creating duplicate mappings
    const [mapping, created] = await EndpointApplicationMapping.findOrCreate({
      where: {
        endpoint_id,
        application_id,
      },
      defaults: {
        status,
      },
    });

    if (!created) {
      return res.status(400).json({ error: 'Mapping already exists' });
    }

    res.status(201).json(mapping);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ error: error.message });
  }
};

// Get all mappings with optional ordering
const getAllMappings = async (req, res) => {
  try {
    const orderBy = req.query.orderBy || 'hostname'; // Default sorting by hostname
    const sortOrder = req.query.sortOrder || 'ASC'; // Default sorting in ascending order

    // Fetch mappings grouped by Endpoint with a list of associated Applications
    const mappings = await EndpointApplicationMapping.findAll({
      include: [
        {
          model: Endpoint,
          required: true,
          attributes: ['id', 'hostname'],
        },
        {
          model: Application,
          required: true,
          attributes: ['id', 'name'],
        },
      ],
      order: [[Endpoint, orderBy, sortOrder]], // Allow ordering based on query params
    });

    const result = mappings.reduce((acc, mapping) => {
      const endpoint = mapping.Endpoint;
      const application = mapping.Application;

      const existingEndpoint = acc.find((e) => e.endpoint.id === endpoint.id);

      if (existingEndpoint) {
        existingEndpoint.applications.push(application);
      } else {
        acc.push({
          endpoint,
          applications: [application],
        });
      }

      return acc;
    }, []); // Reduce mappings to a structured response

    res.status(200).json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ error: error.message });
  }
};

// Get a specific mapping by ID
const getMapping = async (req, res) => {
  try {
    const { id } = req.params; // Get the endpoint_id from the URL parameters

    // Validate the input ID (ensure it's a valid UUID)
    if (!uuidv4().test(id)) {
      return res.status(400).json({ error: 'Invalid Endpoint ID format' });
    }

    // Fetch the EndpointApplicationMapping for the given endpoint_id and include the associated Application details
    const mappings = await EndpointApplicationMapping.findAll({
      where: { endpoint_id: id }, // Filter by endpoint_id
      include: [
        {
          model: Application, // Include Application details
          attributes: ['id', 'name', 'description'], // Select only relevant fields for Application
        },
      ],
    });

    // If no mappings found, return an appropriate error
    if (mappings.length === 0) {
      return res.status(404).json({ error: 'No applications found for this Endpoint' });
    }

    // Extract the applications from the mappings and return the response
    const applications = mappings.map(mapping => mapping.Application);

    res.status(200).json({
      endpoint_id: id,
      applications,
    });
  } catch (error) {
    console.error('Error fetching applications for Endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a mapping
const updateMapping = async (req, res) => {
  try {
    const { endpoint_id, application_id, status } = req.body;

    // Validate input
    if (!endpoint_id || !application_id || !status) {
      return res.status(400).json({ error: 'endpoint_id, application_id, and status are required' });
    }

    // Find the mapping by ID
    const mapping = await EndpointApplicationMapping.findByPk(req.params.id);

    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }

    // Update the mapping with the provided data or keep existing values
    mapping.endpoint_id = endpoint_id || mapping.endpoint_id;
    mapping.application_id = application_id || mapping.application_id;
    mapping.status = status || mapping.status;

    // Save the updated mapping
    await mapping.save();
    res.status(200).json(mapping);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ error: error.message });
  }
};

// Delete a mapping
const deleteMapping = async (req, res) => {
  try {
    // Find the mapping by ID
    const mapping = await EndpointApplicationMapping.findByPk(req.params.id);

    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }

    // Destroy the mapping
    await mapping.destroy();
    res.status(200).json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createMapping,
  getAllMappings,
  getMapping,
  updateMapping,
  deleteMapping,
};