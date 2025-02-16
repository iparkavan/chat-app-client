// next.config.mjs
import withSvgr from "next-svgr";

const nextConfig = {
  // Your existing Next.js configuration options here
  images: {
    domains: ["lh3.googleusercontent.com", "localhost"],
  },
  async headers() {
    return [
      {
        // Apply this rule to all routes in your application
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none", // or 'same-origin' based on your security needs
          },
        ],
      },
    ];
  },
};

export default withSvgr(nextConfig);

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     typedRoutes: true,
//   },
// }

// module.exports = nextConfig
