import "server-only";

import { cookies } from "next/headers";

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * @typedef {RequestInit & { timeout?: number }} ExpressRequestInit
 */

/**
 * Error returned when Express responds with a non-success HTTP status.
 */
export class ExpressApiError extends Error {
  /**
   * @param {string} message
   * @param {{ status: number, statusText: string, url: string, body: string | null }} details
   */
  constructor(message, details) {
    super(message);
    this.name = "ExpressApiError";
    this.status = details.status;
    this.statusText = details.statusText;
    this.url = details.url;
    this.body = details.body;
  }
}

/**
 * Returns the runtime Express base URL. Keeping this check inside the request
 * path means `next build` never requires an Express service or API_URL value.
 *
 * @returns {string}
 */
function getApiUrl() {
  const apiUrl = process.env.API_URL?.trim();

  if (!apiUrl) {
    throw new Error("API_URL must be set before making an Express API request.");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(apiUrl);
  } catch {
    throw new Error("API_URL must be a valid absolute HTTP(S) URL.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("API_URL must use the http or https protocol.");
  }

  return apiUrl.replace(/\/+$/, "");
}

/**
 * Builds an API URL while ensuring caller-provided paths cannot redirect the
 * visitor's cookies to a different origin.
 *
 * @param {string} path A root-relative Express path, for example `/courses`.
 * @returns {string}
 */
function getRequestUrl(path) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    throw new TypeError("Express API path must be a root-relative path beginning with '/'.");
  }

  return `${getApiUrl()}${path}`;
}

/**
 * Read a small, diagnostic-safe portion of an error response without consuming
 * the response that callers may inspect in error instrumentation.
 *
 * @param {Response} response
 * @returns {Promise<string | null>}
 */
async function getErrorBody(response) {
  try {
    const body = await response.clone().text();
    return body ? body.slice(0, 4096) : null;
  } catch {
    return null;
  }
}

/**
 * Makes a server-side request to the Express application.
 *
 * This transport is server-only. It forwards the incoming HTTP-only cookies to
 * Express because server-side `fetch` does not have the browser's cookie jar.
 * Responses with non-2xx status codes throw {@link ExpressApiError}.
 *
 * @param {string} path A root-relative Express API path, such as `/courses`.
 * @param {ExpressRequestInit} [init={}] Standard Fetch request options plus an
 * optional timeout in milliseconds.
 * @returns {Promise<Response>} The successful Express response.
 * @throws {ExpressApiError} When Express returns a non-2xx response.
 */
export async function expressRequest(path, init = {}) {
  const { timeout = DEFAULT_TIMEOUT_MS, signal, ...fetchInit } = init;

  if (!Number.isFinite(timeout) || timeout < 0) {
    throw new TypeError("Request timeout must be a non-negative number of milliseconds.");
  }

  const cookieStore = await cookies();
  const requestHeaders = new Headers(fetchInit.headers);
  const cookieHeader = cookieStore.toString();
  const controller = new AbortController();
  let timedOut = false;
  let removeAbortListener = () => {};

  if (signal) {
    const abortFromCaller = () => controller.abort(signal.reason);

    if (signal.aborted) {
      abortFromCaller();
    } else {
      signal.addEventListener("abort", abortFromCaller, { once: true });
      removeAbortListener = () => signal.removeEventListener("abort", abortFromCaller);
    }
  }

  const timeoutId =
    timeout === 0
      ? undefined
      : setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, timeout);

  // Do not accept a caller-supplied Cookie header: this request represents the
  // current visitor and must only forward that visitor's incoming cookies.
  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  } else {
    requestHeaders.delete("cookie");
  }

  try {
    const response = await fetch(getRequestUrl(path), {
      ...fetchInit,
      headers: requestHeaders,
      signal: controller.signal,
      cache: fetchInit.cache ?? "no-store",
    });

    if (!response.ok) {
      const body = await getErrorBody(response);
      throw new ExpressApiError(
        `Express API request failed: ${response.status} ${response.statusText}`,
        {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body,
        },
      );
    }

    return response;
  } catch (error) {
    if (timedOut) {
      throw new Error(`Express API request timed out after ${timeout}ms.`, { cause: error });
    }

    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    removeAbortListener();
  }
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<Response>} */
export function get(path, init = {}) {
  return expressRequest(path, { ...init, method: "GET" });
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<Response>} */
export function post(path, init = {}) {
  return expressRequest(path, { ...init, method: "POST" });
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<Response>} */
export function patch(path, init = {}) {
  return expressRequest(path, { ...init, method: "PATCH" });
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<Response>} */
export function put(path, init = {}) {
  return expressRequest(path, { ...init, method: "PUT" });
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<Response>} */
export function del(path, init = {}) {
  return expressRequest(path, { ...init, method: "DELETE" });
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<unknown>} */
export async function getJson(path, init = {}) {
  return (await get(path, init)).json();
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<unknown>} */
export async function postJson(path, init = {}) {
  return (await post(path, init)).json();
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<unknown>} */
export async function patchJson(path, init = {}) {
  return (await patch(path, init)).json();
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<unknown>} */
export async function putJson(path, init = {}) {
  return (await put(path, init)).json();
}

/** @param {string} path @param {ExpressRequestInit} [init={}] @returns {Promise<unknown>} */
export async function deleteJson(path, init = {}) {
  return (await del(path, init)).json();
}
