import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/7-days-free-classes",
        destination: "/7-days-free-sap-training",
        permanent: true,
      },
      {
        source: "/free-sap-training",
        destination: "/7-days-free-sap-training",
        permanent: true,
      },
      {
        source: "/sap-free-classes",
        destination: "/7-days-free-sap-training",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
