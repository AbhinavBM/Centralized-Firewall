const Endpoint = require('../models/Endpoint');
const Application = require('../models/Application');
const EndpointApplicationMapping = require('../models/EndpointApplicationMapping');

const ApplicationPostController = {
  async saveApplicationsWithMapping(req, res) {
    const data = req.body;

    try {
      // Check if the endpoint exists
      const endpoint = await Endpoint.findOne({
        where: { id: data.endpoint_id },
      });

      if (!endpoint) {
        return res.status(404).json({ message: `Endpoint with ID ${data.endpoint_id} not found.` });
      }

      // Process each application in the input data
      for (const [appName, appData] of Object.entries(data.applications)) {
        // Check if the application already exists
        let application = await Application.findOne({
          where: { name: appName },
        });

        if (!application) {
          // If the application doesn't exist, create it
          application = await Application.create({
            name: appName,
            description: appData.description,
            status: appData.status,
            allowed_domains: [], // Assuming no data for this field in the JSON
            allowed_ips: appData.associated_ips.map(ip => `${ip.source_ip} -> ${ip.destination_ip}`),
            allowed_protocols: [], // Assuming no data for this field in the JSON
            firewall_policies: {
              associated_ips: appData.associated_ips,
              source_ports: appData.source_ports,
              destination_ports: appData.destination_ports,
            },
          });
        } else {
          // If the application exists, append the new rules
          const currentPolicies = application.firewall_policies || {};
          const updatedPolicies = {
            associated_ips: [
              ...(currentPolicies.associated_ips || []),
              ...appData.associated_ips,
            ].filter(
              (v, i, a) =>
                a.findIndex(t => t.source_ip === v.source_ip && t.destination_ip === v.destination_ip) === i
            ), // Remove duplicates
            source_ports: [
              ...(currentPolicies.source_ports || []),
              ...appData.source_ports,
            ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
            destination_ports: [
              ...(currentPolicies.destination_ports || []),
              ...appData.destination_ports,
            ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
          };

          // Update the application with the merged policies
          await application.update({
            firewall_policies: updatedPolicies,
            allowed_ips: updatedPolicies.associated_ips.map(ip => `${ip.source_ip} -> ${ip.destination_ip}`),
          });
        }

        // Create a mapping between the endpoint and the application
        await EndpointApplicationMapping.findOrCreate({
          where: {
            endpoint_id: endpoint.id,
            application_id: application.id,
          },
          defaults: {
            status: 'Active',
          },
        });
      }

      res.status(200).json({ message: 'Applications and mappings saved successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving applications and mappings', error: error.message });
    }
  },
};

module.exports = ApplicationPostController;
