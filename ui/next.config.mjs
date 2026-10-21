/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Dynamically allow requests to your Render backend
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
  : "http://localhost:5000";

// In dev mode, also allow localhost fallback
const CONNECT_SRC = isDev
  ? `'self' ${API_ORIGIN} http://localhost:5000 http://127.0.0.1:5000 ws://localhost:3000 ws://localhost:5000 wss://${new URL(API_ORIGIN).host}`
  : `'self' ${API_ORIGIN} wss://${new URL(API_ORIGIN).host}`;

const nextConfig = {
  experimental: { agentFeedback: true },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  poweredByHeader: false,
  compress: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              `connect-src ${CONNECT_SRC}`, // <-- Dynamic
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;