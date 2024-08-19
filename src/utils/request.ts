import { host } from 'config';
import { sleep } from './common';

export const getHost = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : host;
};

export const retryWrap = async <T>(
  fn: () => Promise<T>,
  cancelStrategy?: (data: T) => boolean,
  time = 1000 * 60,
  interval = 1000,
) => {
  let timer: NodeJS.Timeout;
  const now = Date.now();
  const retry = async () => {
    console.log('retry', new Date());
    try {
      const res = await fn();
      if (cancelStrategy && cancelStrategy(res)) {
        clearTimeout(timer);
        return res;
      }
      const cur = Date.now();
      const diff = cur - now;
      if (diff > time) {
        clearTimeout(timer);
        return null;
      }
      await sleep(interval);
      return retry();
    } catch (error) {
      return retry();
    }
  };
  return retry();
};
