import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusConfig {
  label: string;
  color: ChipProps['color'];
}

interface StatusChipProps {
  status: string;
  statusMap: Record<string, StatusConfig>;
}

const StatusChip: React.FC<StatusChipProps> = ({ status, statusMap }) => {
  const config = statusMap[status] || { label: status, color: 'default' };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 'medium' }}
    />
  );
};

export default StatusChip;
