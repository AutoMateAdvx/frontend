/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '1000mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tse3-mm.cn.bing.net',
                // 可选：限制特定路径
                // pathname: '/th/**',
            },
            // 可以添加其他允许的域名
            {
                protocol: 'https',
                hostname: '**.example.com', // 使用通配符允许子域名
            },
        ],
        // 可选：允许所有远程图片（不推荐用于生产环境）
        // dangerouslyAllowSVG: true,
        // contentDispositionType: 'attachment',
        // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
}

module.exports = nextConfig