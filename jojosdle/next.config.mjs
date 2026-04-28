/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jojos-bizarre-api.netlify.app",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
