import { createServerFn } from '@tanstack/react-start';
import { Result, TaggedError } from 'better-result';
import { ENV } from 'varlock/env';
import { validateDeviceToken } from './auth';

export enum KagiWorkflow {
  Search = 'search',
  Images = 'images',
  Videos = 'videos',
  News = 'news',
  Podcasts = 'podcasts',
}

export interface KagiSearchImage {
  url: string;
  height?: number;
  width?: number;
}

export interface KagiSearchResult {
  url: string;
  title: string;
  snippet?: string;
  time?: string;
  image?: KagiSearchImage;
  props?: Record<string, string | number | boolean | null>;
}

export interface KagiSearchResponse {
  meta: {
    trace: string;
    node: string;
    ms: number;
  };
  data: {
    search: KagiSearchResult[];
    image?: KagiSearchResult[];
    video?: KagiSearchResult[];
    news?: KagiSearchResult[];
    podcast?: KagiSearchResult[];
    related_search?: { url: string; title: string }[];
  };
}

export class KagiApiError extends TaggedError('KagiApiError')<{
  status: number;
  message: string;
}> {}

export class NetworkError extends TaggedError('NetworkError')<{
  message: string;
}> {}

type SearchError = NetworkError | KagiApiError;

interface SearchInput {
  query: string;
  deviceToken: string;
  workflow?: KagiWorkflow;
  page?: number;
  limit?: number;
}

async function fetchKagiSearch(
  query: string,
  workflow: KagiWorkflow,
  page: number,
  limit: number
): Promise<Result<KagiSearchResponse, SearchError>> {
  const fetchResult = await Result.tryPromise(() =>
    fetch('https://kagi.com/api/v1/search', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${ENV.KAGI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, workflow, page, limit }),
    })
  );

  if (Result.isError(fetchResult)) {
    return Result.err(
      new NetworkError({
        message: `Failed to reach Kagi: ${fetchResult.error.message}`,
      })
    );
  }

  const response = fetchResult.value;

  if (!response.ok) {
    const text = await response.text();
    return Result.err(
      new KagiApiError({
        status: response.status,
        message: `Kagi API error ${response.status}: ${text}`,
      })
    );
  }

  const parseResult = await Result.tryPromise(
    () => response.json() as Promise<KagiSearchResponse>
  );

  if (Result.isError(parseResult)) {
    return Result.err(
      new NetworkError({
        message: `Failed to parse Kagi response: ${parseResult.error.message}`,
      })
    );
  }

  return Result.ok(parseResult.value);
}

export const searchKagi = createServerFn({ method: 'POST' })
  .validator((input: SearchInput) => input)
  .handler(async ({ data }) => {
    const authResult = validateDeviceToken(data.deviceToken);
    if (Result.isError(authResult)) {
      throw new Error(authResult.error.message);
    }

    const result = await fetchKagiSearch(
      data.query,
      data.workflow ?? KagiWorkflow.Search,
      data.page ?? 1,
      data.limit ?? 20
    );

    return result.match({
      ok: (value) => value,
      err: (error) => {
        throw new Error(error.message);
      },
    });
  });
