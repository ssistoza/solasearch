import { createCsrfMiddleware, createStart } from '@tanstack/react-start';
import { cacheControlMiddleware } from './utils/cache-control';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [cacheControlMiddleware, csrfMiddleware],
}));
