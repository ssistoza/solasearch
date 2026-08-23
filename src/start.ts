import { createStart } from '@tanstack/react-start';
import { cacheControlMiddleware } from './utils/cache-control';

export const startInstance = createStart(() => ({
  requestMiddleware: [cacheControlMiddleware],
}));
