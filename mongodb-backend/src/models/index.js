// Export all models from a single file for easier imports
const User = require('./User');
const Endpoint = require('./Endpoint');
const Application = require('./Application');
const EndpointApplicationMapping = require('./EndpointApplicationMapping');
const TrafficLog = require('./TrafficLog');
const FirewallRule = require('./FirewallRule');
const Anomaly = require('./Anomaly');
const Log = require('./Log');

module.exports = {
  User,
  Endpoint,
  Application,
  EndpointApplicationMapping,
  TrafficLog,
  FirewallRule,
  Anomaly,
  Log
};
