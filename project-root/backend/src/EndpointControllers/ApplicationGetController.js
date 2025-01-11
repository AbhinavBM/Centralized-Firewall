const Endpoint = require('../models/Endpoint');
const Application = require('../models/Application');
const EndpointApplicationMapping = require('../models/EndpointApplicationMapping');

const ApplicationGetController = {
  async getApplicationsByEndpoint(req, res) {
    const { endpoint_id } = req.params;

    try {
      // Check if the endpoint exists
      const endpoint = await Endpoint.findOne({
        where: { id: endpoint_id },
      });

      if (!endpoint) {
        return res.status(404).json({ message: `Endpoint with ID ${endpoint_id} not found.` });
      }

      // Fetch all mappings for the endpoint
      const mappings = await EndpointApplicationMapping.findAll({
        where: { endpoint_id },
      });

      if (!mappings || mappings.length === 0) {
        return res.status(404).json({
          message: `No applications are associated with Endpoint ID ${endpoint_id}.`,
        });
      }

      // Fetch application details
      const applications = {};
      for (const mapping of mappings) {
        const application = await Application.findOne({
          where: { id: mapping.application_id },
        });

        if (application) {
          applications[application.name] = {
            description: application.description,
            status: application.status,
            associated_ips: application.firewall_policies?.associated_ips || [],
            source_ports: application.firewall_policies?.source_ports || [],
            destination_ports: application.firewall_policies?.destination_ports || [],
          };
        }
      }

      // Build the final response object
      const response = {
        endpoint_id,
        applications,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applications by endpoint', error: error.message });
    }
  },
};

module.exports = ApplicationGetController;
