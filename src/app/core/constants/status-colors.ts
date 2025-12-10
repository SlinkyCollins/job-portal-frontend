export const STATUS_COLORS = {
  PENDING: '#FFD600',
  ACCEPTED: '#43A047',
  REJECTED: '#E53935',
  SHORTLISTED: '#1E88E5',
  RETRACTED: '#757575'
};

export type ApplicationStatus = keyof typeof STATUS_COLORS;
