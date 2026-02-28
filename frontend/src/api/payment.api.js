import api from './client';

export const processPayment = async (amount) => {
  const response = await api.post('/payment/pay', { amount });
  return response.data;
};

export const simulateBulk = async (count) => {
  const response = await api.post('/simulate-bulk', { count });
  return response.data;
};
