import { HttpClient } from "../http.js";
import type { FetcherEnvelope, RequestOptions } from "../types.js";

/** Shared plumbing for every service namespace. */
export abstract class BaseService {
  constructor(protected readonly http: HttpClient) {}

  /** GET a fully-formed path (already substituted). */
  protected getPath<T = unknown>(path: string, options?: RequestOptions) {
    return this.http.get<T>(path, options) as Promise<T | FetcherEnvelope<T>>;
  }

  /** GET a templated path, substituting `{param}` placeholders first. */
  protected getTemplate<T = unknown>(
    template: string,
    pathParams: Record<string, string | number>,
    options?: RequestOptions,
  ) {
    const path = HttpClient.buildPath(template, pathParams);
    return this.http.get<T>(path, options) as Promise<T | FetcherEnvelope<T>>;
  }
}
