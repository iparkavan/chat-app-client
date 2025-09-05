// next.config.mjs
import withSvgr from "next-svgr";

const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "localhost",
      "chat-app-server-q8xe.onrender.com",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // {
      //   source: "/api/:path*",
      //   destination:
      //     process.env.NODE_ENV === "production"
      //       ? "https://chat-app-server-q8xe.onrender.com/api/:path*"
      //       : "http://localhost:4000/api/:path*",
      // },
      {
        source: "/api/:path*",
        destination: "https://your-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default withSvgr(nextConfig);


// // next.config.mjs
// import withSvgr from "next-svgr";

// const nextConfig = {
//   // Your existing Next.js configuration options here
//   images: {
//     domains: ["lh3.googleusercontent.com", "localhost", "chat-app-server-q8xe.onrender.com"],
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   async headers() {
//     return [
//       {
//         // Apply this rule to all routes in your application
//         source: "/:path*",
//         headers: [
//           {
//             key: "Cross-Origin-Opener-Policy",
//             value: "unsafe-none", // or 'same-origin' based on your security needs
//           },
//         ],
//       },
//     ];
//   },
// };

// export default withSvgr(nextConfig);

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     typedRoutes: true,
//   },
// }

// module.exports = nextConfig
