export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const GATEWAY_BASE = API_BASE.replace(/\/api$/, '');
