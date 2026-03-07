import { BACKEND_URL } from '../config';

export const getImageUrl = (p) => {
  if (!p) return null;
  return p.startsWith('/uploads/') ? `${BACKEND_URL}${p}` : p;
};

export const formatCurrency = (amount) => {
  return `₱${amount.toFixed(2)}`;
};
