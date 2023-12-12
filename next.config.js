/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
            allowedOrigins: ["dimipay.ldhdev.com"]
        }
    }
}

module.exports = nextConfig
