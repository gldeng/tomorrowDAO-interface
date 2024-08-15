import { host } from 'config';

export const getHost = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : host;
};
