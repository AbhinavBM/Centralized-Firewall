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

      // Build the firewall rules dynamically
      const firewall_rules = [];
      for (const mapping of mappings) {
        const application = await Application.findOne({
          where: { id: mapping.application_id },
        });

        if (application) {
          const policies = application.firewall_policies || {};
          const associatedIPs = policies.destination_ips || [];
          const sourcePorts = policies.source_ports || [];
          const destinationPorts = policies.destination_ports || [];
          const allowedDomains = application.allowed_domains || [];
          const service = application.name;

          // Add rules only for allowed destination IPs
          associatedIPs.forEach(dst_ip => {
            if (dst_ip) {
              firewall_rules.push({
                src_ip: null,
                dst_ip,
                src_port: null,
                domain: null,
                dst_port: null,
                protocol: null,
                action: "allow",
                service,
              });
            }
          });
        }
      }

      res.status(200).json({
        endpoint_id,
        firewall_rules: firewall_rules.map(rule => ({
          src_ip: rule.src_ip,
          dst_ip: rule.dst_ip,
          src_port: rule.src_port,
          domain: rule.domain,
          dst_port: rule.dst_port,
          protocol: rule.protocol,
          action: rule.action,
          service: rule.service,
        })),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applications by endpoint', error: error.message });
    }
  },
};

module.exports = ApplicationGetController;
