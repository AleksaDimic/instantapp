import type { NextConfig } from "next";

const NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "i.imgur.com",
      "imgur.com",
    ],
  },
};

export default NextConfig;
