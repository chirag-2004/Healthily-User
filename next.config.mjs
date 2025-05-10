/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**", // Allows images from any path on this domain
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**", // Allows images from any path on this domain
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
        port: "",
        pathname: "**", // Allows images from any path on this domain
      },
    ],
  },
};

export default nextConfig;
