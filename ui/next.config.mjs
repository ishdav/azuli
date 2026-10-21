/** @type {import('next').NextConfig} */

// Dynamically allow requests to your Render backend.
// Falls back to localhost during development.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
  : "http://localhost:5000";

const nextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // ✅ SECURITY: Hide the "X-Powered-By: Next.js" header
  poweredByHeader: false,

  // ✅ SECURITY: Enable Gzip/Brotli compression
  compress: true,

  // ✅ SECURITY: Add HTTP response headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 1. Prevent Clickjacking (site can't be embedded in an iframe)
          { key: "X-Frame-Options", value: "DENY" },

          // 2. Prevent MIME-type sniffing attacks
          { key: "X-Content-Type-Options", value: "nosniff" },

          // 3. Force HTTPS for 2 years (defeats SSL-stripping attacks)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // 4. Control what info is leaked via the Referer header
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // 5. Disable sensitive browser APIs (camera, mic, etc.)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // 6. PRIVACY: Tell all search engines not to index the site
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },

          // 7. Content Security Policy: The master XSS blocker
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-inline and unsafe-eval for hydration & React Compiler
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              // Tailwind v4 injects inline <style> tags
              "style-src 'self' 'unsafe-inline'",
              // Allow images from your own domain, data URIs, and any HTTPS source
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              // ✅ Only allow API calls to your own backend (not anyone else's)
              `connect-src 'self' ${API_ORIGIN} wss://${new URL(API_ORIGIN).host}`,
              // Prevent the page from being embedded anywhere
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },

          // 8. Isolate the browser context (Spectre mitigation)
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },

  // ✅ SECURITY: Whitelist image domains if you ever use next/image
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.onrender.com" },
    ],
  },
};

export default nextConfig;