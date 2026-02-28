import api from './client';

export const getMetrics = async () => {
  const response = await api.get('/metrics');
  return response.data;
};

export const getGatewayHealth = async () => {
  const response = await api.get('/gateway');
  return response.data;
};
