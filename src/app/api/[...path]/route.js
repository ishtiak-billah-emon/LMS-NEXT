import { NextResponse } from "next/server";

const BACKEND_BASE = process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();

if (!BACKEND_BASE) {
  throw new Error("API_URL or NEXT_PUBLIC_API_URL must be set for the BFF proxy.");
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

export async function GET(request, { params }) {
  return proxy(request, params.path);
}

export async function POST(request, { params }) {
  return proxy(request, params.path);
}

export async function PUT(request, { params }) {
  return proxy(request, params.path);
}

export async function PATCH(request, { params }) {
  return proxy(request, params.path);
}

export async function DELETE(request, { params }) {
  return proxy(request, params.path);
}

export async function OPTIONS(request, { params }) {
  return proxy(request, params.path);
}

async function proxy(request, pathSegments) {
  const path = `/${pathSegments.join("/")}`;
  const backendUrl = `${BACKEND_BASE}${path}${request.nextUrl.search}`;

  const requestHeaders = forwardHeaders(request.headers);

  const method = request.method;
  const body =
    method !== "GET" && method !== "HEAD" && method !== "OPTIONS"
      ? await request.arrayBuffer()
      : undefined;

  const response = await fetch(backendUrl, {
    method,
    headers: requestHeaders,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);

  const setCookieHeaders = responseHeaders.getSetCookie();
  responseHeaders.delete("set-cookie");
  for (const cookie of setCookieHeaders) {
    responseHeaders.append("Set-Cookie", stripCookieDomain(cookie));
  }

  responseHeaders.set("Access-Control-Allow-Origin", request.headers.get("origin") || "*");
  responseHeaders.set("Access-Control-Allow-Credentials", "true");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
