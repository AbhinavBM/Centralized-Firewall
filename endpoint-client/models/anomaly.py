class Anomaly:
    """
    Model representing an anomaly.
    """
    def __init__(self, anomaly_id=None, endpoint_id=None, application_id=None, 
                 anomaly_type=None, description=None, severity=None, 
                 timestamp=None, resolved=False, resolved_by=None, resolved_at=None):
        self.id = anomaly_id
        self.endpointId = endpoint_id
        self.applicationId = application_id
        self.anomalyType = anomaly_type
        self.description = description
        self.severity = severity
        self.timestamp = timestamp
        self.resolved = resolved
        self.resolvedBy = resolved_by
        self.resolvedAt = resolved_at
    
    @classmethod
    def from_dict(cls, data):
        """
        Create an Anomaly instance from a dictionary.
        """
        return cls(
            anomaly_id=data.get('_id') or data.get('id'),
            endpoint_id=data.get('endpointId'),
            application_id=data.get('applicationId'),
            anomaly_type=data.get('anomalyType'),
            description=data.get('description'),
            severity=data.get('severity'),
            timestamp=data.get('timestamp'),
            resolved=data.get('resolved', False),
            resolved_by=data.get('resolvedBy'),
            resolved_at=data.get('resolvedAt')
        )
    
    def to_dict(self):
        """
        Convert the Anomaly instance to a dictionary.
        """
        return {
            'id': self.id,
            'endpointId': self.endpointId,
            'applicationId': self.applicationId,
            'anomalyType': self.anomalyType,
            'description': self.description,
            'severity': self.severity,
            'timestamp': self.timestamp,
            'resolved': self.resolved,
            'resolvedBy': self.resolvedBy,
            'resolvedAt': self.resolvedAt
        }
    
    def __repr__(self):
        return f"<Anomaly {self.anomalyType} - {self.severity}>"
