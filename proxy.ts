import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per window
const ipRequestMap = new Map<string, { count: number; startTime: number }>();

// Clean up map periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestMap.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW) {
      ipRequestMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

const isPublicRoute = createRouteMatcher([
  "/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Rate Limiting Logic
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  const now = Date.now();
  const requestData = ipRequestMap.get(ip) || { count: 0, startTime: now };

  if (now - requestData.startTime > RATE_LIMIT_WINDOW) {
    // Reset window
    requestData.count = 1;
    requestData.startTime = now;
  } else {
    requestData.count++;
  }

  ipRequestMap.set(ip, requestData);

  if (requestData.count > MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // Clerk Auth Logic
  if (!isPublicRoute(req)) {
    const { userId, orgId } = await auth();
    if (!userId) {
      const authObject = await auth();
      return authObject.redirectToSignIn();
    }
    // If authenticated but no active organization, redirect to organization selection
    // Note: Clerk handles this via /select-organization if configured, 
    // but we can also check for orgId here.
    if (!orgId && !req.nextUrl.pathname.startsWith('/select-organization')) {
      const orgSelection = new URL('/select-organization', req.url);
      return NextResponse.redirect(orgSelection);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
