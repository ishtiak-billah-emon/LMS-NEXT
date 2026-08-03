import { NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();

if (!BACKEND_BASE) {
  throw new Error(
    "API_URL or NEXT_PUBLIC_API_URL must be set for the BFF proxy."
  );
}

function stripCookieDomain(setCookieHeader) {
  return setCookieHeader.replace(/;\s*Domain=[^;]+/gi, "");
}

function forwardHeaders(requestHeaders) {
  const headers = new Headers();

  for (const [key, value] of requestHeaders) {
    if (key === "host") continue;
    headers.set(key, value);
  }

  return headers;
}

export async function GET(request, context) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(request, context) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(request, context) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(request, context) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(request, context) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function OPTIONS(request, context) {
  const { path } = await context.params;
  return proxy(request, path);
}

async function proxy(request, pathSegments = []) {
  const path = `/${pathSegments.join("/")}`;
  const backendUrl = `${BACKEND_BASE}${path}${request.nextUrl.search}`;

  const requestHeaders = forwardHeaders(request.headers);

  const method = request.method;

  const body =
    method !== "GET" &&
    method !== "HEAD" &&
    method !== "OPTIONS"
      ? await request.arrayBuffer()
      : undefined;

  const response = await fetch(backendUrl, {
    method,
    headers: requestHeaders,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);

  // fetch() may transparently decode the upstream body (e.g. gzip) while
  // leaving these framing headers describing the original wire format.
  // Forwarding them verbatim onto the re-streamed body causes the browser
  // to see a length/encoding mismatch and abort the response as a network
  // error, even though the headers (incl. Set-Cookie) already landed.
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("connection");

  const setCookieHeaders = responseHeaders.getSetCookie();

  responseHeaders.delete("set-cookie");

  for (const cookie of setCookieHeaders) {
    responseHeaders.append(
      "Set-Cookie",
      stripCookieDomain(cookie)
    );
  }

  responseHeaders.set(
    "Access-Control-Allow-Origin",
    request.headers.get("origin") || "*"
  );

  responseHeaders.set(
    "Access-Control-Allow-Credentials",
    "true"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}