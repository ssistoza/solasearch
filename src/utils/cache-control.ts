import { createMiddleware } from '@tanstack/react-start';

const CACHEABLE_PATHS = /^\/(?:$|search)/;

export const cacheControlMiddleware = createMiddleware({ type: 'request' })
  .server(async ({ request, pathname, next, handlerType }) => {
    const result = await next();

    if (
      handlerType !== 'router' ||
      request.method !== 'GET' ||
      !CACHEABLE_PATHS.test(pathname)
    ) {
      return result;
    }

    try {
      result.response.headers.set('Cache-Control', 'private, max-age=86400');
      return result;
    } catch {
      const headers = new Headers(result.response.headers);
      headers.set('Cache-Control', 'private, max-age=86400');
      return new Response(result.response.body, {
        status: result.response.status,
        statusText: result.response.statusText,
        headers,
      });
    }
  });
