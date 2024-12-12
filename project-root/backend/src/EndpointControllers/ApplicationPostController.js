const Endpoint = require('../models/Endpoint');
const Application = require('../models/Application');
const EndpointApplicationMapping = require('../models/EndpointApplicationMapping');

const isValidIP = (ip) => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

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
        // Extract and validate destination IPs
        const validDestinationIPs = appData.associated_ips
          .map(ip => ip.destination_ip)
          .filter(isValidIP)
          .filter((ip, index, self) => self.indexOf(ip) === index); // Ensure unique IPs

        // Skip application creation if no valid destination IPs
        if (validDestinationIPs.length === 0) {
          continue;
        }

        // Extract allowed domains from the request data
        const allowedDomains = appData.allowed_domains || []; // Default to an empty array if no data is provided
        console.log(allowedDomains);
        // Check if the application already exists
        let application = await Application.findOne({
          where: { name: `${appName}_Eid_${endpoint.id}` },
        });

        if (!application) {

          // If the application doesn't exist, create it
          application = await Application.create({
            name: `${appName}_${endpoint.id}`,
            description: appData.description,
            status: appData.status,
            allowed_domains: allowedDomains, // Store allowed domains
            allowed_ips: validDestinationIPs, // Store only valid destination IPs
            allowed_protocols: [], // Assuming no data for this field in the JSON
            firewall_policies: {
              destination_ips: validDestinationIPs, // Store only valid destination IPs
              source_ports: appData.source_ports,
              destination_ports: appData.destination_ports,
            },
          });
        } else {
          // If the application exists, append the new rules
          const currentPolicies = application.firewall_policies || {};
          const updatedPolicies = {
            destination_ips: [
              ...(currentPolicies.destination_ips || []),
              ...validDestinationIPs,
            ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
            source_ports: [
              ...(currentPolicies.source_ports || []),
              ...appData.source_ports,
            ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
            destination_ports: [
              ...(currentPolicies.destination_ports || []),
              ...appData.destination_ports,
            ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
          };

          // Update the application with the merged policies only if new IPs exist
          if (updatedPolicies.destination_ips.length > (currentPolicies.destination_ips || []).length) {
            await application.update({
              firewall_policies: updatedPolicies,
              allowed_ips: updatedPolicies.destination_ips, // Only destination IPs
              allowed_domains: allowedDomains, // Update allowed domains
            });
          }
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
