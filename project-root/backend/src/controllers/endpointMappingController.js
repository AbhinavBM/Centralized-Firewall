const Endpoint = require('../MappingModel/Endpoint');
const Application = require('../MappingModel/Application');
const EndpointApplicationMapping = require('../MappingModel/EndpointApplicationMapping');

// Create a new mapping with conditional status
const createMapping = async (req, res) => {
  try {
    const { endpoint_id, application_id } = req.body;

    if (!endpoint_id || !application_id) {
      return res.status(400).json({ error: 'Both endpoint_id and application_id are required.' });
    }

    const endpoint = await Endpoint.findOne({ where: { id: endpoint_id } });
    const application = await Application.findOne({ where: { id: application_id } });

    if (!endpoint || !application) {
      return res.status(404).json({ error: 'Endpoint or Application not found.' });
    }

    let status = 'Active';
    if (endpoint.hostname === 'server-05' && application.name === 'Web Application A') {
      status = 'Inactive';
    }

    const [mapping, created] = await EndpointApplicationMapping.findOrCreate({
      where: { endpoint_id, application_id },
      defaults: { status },
    });

    if (!created) {
      return res.status(409).json({ error: 'Mapping already exists.' });
    }

    res.status(201).json(mapping);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Fetch all mappings
const getAllMappings = async (req, res) => {
  try {
    const orderBy = req.query.orderBy || 'hostname';
    const sortOrder = req.query.sortOrder || 'ASC';

    const mappings = await EndpointApplicationMapping.findAll({
      include: [
        {
          model: Endpoint,
          attributes: ['id', 'hostname'],
        },
        {
          model: Application,
          attributes: ['id', 'name'],
        },
      ],
      order: [[Endpoint, orderBy, sortOrder]], // Corrected order usage
    });

    const result = mappings.reduce((acc, mapping) => {
      const endpoint = mapping.Endpoint;
      const application = mapping.Application;

      const existingEndpoint = acc.find((e) => e.endpoint.id === endpoint.id);
      if (existingEndpoint) {
        existingEndpoint.applications.push(application);
      } else {
        acc.push({ endpoint, applications: [application] });
      }

      return acc;
    }, []);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Fetch a specific mapping by Endpoint ID
const getMapping = async (req, res) => {
  try {
    const { id } = req.params;

    const mappings = await EndpointApplicationMapping.findAll({
      where: { endpoint_id: id },
      include: [
        {
          model: Application,
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (mappings.length === 0) {
      return res.status(404).json({ error: 'No applications found for this Endpoint.' });
    }

    const applications = mappings.map((mapping) => mapping.Application);
    res.status(200).json({ endpoint_id: id, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update a mapping
const updateMapping = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const mapping = await EndpointApplicationMapping.findByPk(id);

    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found.' });
    }

    mapping.status = status;
    await mapping.save();

    res.status(200).json(mapping);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Delete a mapping
const deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;

    const mapping = await EndpointApplicationMapping.findByPk(id);

    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found.' });
    }

    await mapping.destroy();
    res.status(200).json({ message: 'Mapping deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  createMapping,
  getAllMappings,
  getMapping,
  updateMapping,
  deleteMapping,
};
