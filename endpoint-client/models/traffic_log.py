class TrafficLog:
    """
    Model representing a traffic log.
    """
    def __init__(self, log_id=None, endpoint_id=None, application_id=None, 
                 source_ip=None, destination_ip=None, source_port=None, 
                 destination_port=None, protocol=None, status=None, 
                 traffic_type=None, data_transferred=0, packet_data=None, 
                 timestamp=None):
        self.id = log_id
        self.endpointId = endpoint_id
        self.applicationId = application_id
        self.sourceIp = source_ip
        self.destinationIp = destination_ip
        self.sourcePort = source_port
        self.destinationPort = destination_port
        self.protocol = protocol
        self.status = status
        self.trafficType = traffic_type
        self.dataTransferred = data_transferred
        self.packetData = packet_data
        self.timestamp = timestamp
    
    @classmethod
    def from_dict(cls, data):
        """
        Create a TrafficLog instance from a dictionary.
        """
        return cls(
            log_id=data.get('_id') or data.get('id'),
            endpoint_id=data.get('endpointId'),
            application_id=data.get('applicationId'),
            source_ip=data.get('sourceIp'),
            destination_ip=data.get('destinationIp'),
            source_port=data.get('sourcePort'),
            destination_port=data.get('destinationPort'),
            protocol=data.get('protocol'),
            status=data.get('status'),
            traffic_type=data.get('trafficType'),
            data_transferred=data.get('dataTransferred', 0),
            packet_data=data.get('packetData'),
            timestamp=data.get('timestamp')
        )
    
    def to_dict(self):
        """
        Convert the TrafficLog instance to a dictionary.
        """
        return {
            'id': self.id,
            'endpointId': self.endpointId,
            'applicationId': self.applicationId,
            'sourceIp': self.sourceIp,
            'destinationIp': self.destinationIp,
            'sourcePort': self.sourcePort,
            'destinationPort': self.destinationPort,
            'protocol': self.protocol,
            'status': self.status,
            'trafficType': self.trafficType,
            'dataTransferred': self.dataTransferred,
            'packetData': self.packetData,
            'timestamp': self.timestamp
        }
    
    def __repr__(self):
        return f"<TrafficLog {self.sourceIp} -> {self.destinationIp}>"
