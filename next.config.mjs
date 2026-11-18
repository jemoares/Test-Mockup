/** @type {import('next').NextConfig} */
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  basePath: base || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  output: "export",
};

export default nextConfig;
