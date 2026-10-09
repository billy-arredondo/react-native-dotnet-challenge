import { apiUrl } from '../config/env';

export class ApiError extends Error {
  readonly status: number;
  readonly detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiUrl}${path}`, { signal });
  } catch {
    throw new ApiError(0, 'Unable to reach the task service. Check your connection.');
  }

  if (!response.ok) {
    let detail: string | undefined;

    try {
      const problem = (await response.json()) as { detail?: string; title?: string };
      detail = problem.detail ?? problem.title;
    } catch {
      // Keep the HTTP status as the useful error when the body is not JSON.
    }

    throw new ApiError(response.status, detail ?? `Request failed with status ${response.status}.`, detail);
  }

  return response.json() as Promise<T>;
}
