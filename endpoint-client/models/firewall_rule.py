class FirewallRule:
    """
    Model representing a firewall rule.
    """
    def __init__(self, rule_id=None, name=None, description=None, source_ip=None, 
                 destination_ip=None, source_port=None, destination_port=None, 
                 protocol=None, action=None, priority=0, enabled=True, 
                 application_id=None, created_at=None, updated_at=None):
        self.id = rule_id
        self.name = name
        self.description = description
        self.sourceIp = source_ip
        self.destinationIp = destination_ip
        self.sourcePort = source_port
        self.destinationPort = destination_port
        self.protocol = protocol
        self.action = action
        self.priority = priority
        self.enabled = enabled
        self.applicationId = application_id
        self.createdAt = created_at
        self.updatedAt = updated_at
    
    @classmethod
    def from_dict(cls, data):
        """
        Create a FirewallRule instance from a dictionary.
        """
        return cls(
            rule_id=data.get('_id') or data.get('id'),
            name=data.get('name'),
            description=data.get('description'),
            source_ip=data.get('sourceIp'),
            destination_ip=data.get('destinationIp'),
            source_port=data.get('sourcePort'),
            destination_port=data.get('destinationPort'),
            protocol=data.get('protocol'),
            action=data.get('action'),
            priority=data.get('priority', 0),
            enabled=data.get('enabled', True),
            application_id=data.get('applicationId'),
            created_at=data.get('createdAt'),
            updated_at=data.get('updatedAt')
        )
    
    def to_dict(self):
        """
        Convert the FirewallRule instance to a dictionary.
        """
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'sourceIp': self.sourceIp,
            'destinationIp': self.destinationIp,
            'sourcePort': self.sourcePort,
            'destinationPort': self.destinationPort,
            'protocol': self.protocol,
            'action': self.action,
            'priority': self.priority,
            'enabled': self.enabled,
            'applicationId': self.applicationId,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt
        }
    
    def __repr__(self):
        return f"<FirewallRule {self.name}>"
