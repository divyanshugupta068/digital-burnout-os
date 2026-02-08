/** @type {import('next').NextConfig} */
const nextConfig = {
    // Production optimizations
    reactStrictMode: true,
    swcMinify: true,

    // Compression
    compress: true,

    // Production source maps (optional - disable for smaller builds)
    productionBrowserSourceMaps: false,

    // Image optimization
    images: {
        domains: [
            'localhost',
            // Add your production image domains here
            // 'your-cdn.com',
            // 's3.amazonaws.com',
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ],
            },
        ];
    },

    // Environment variables available to the browser
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    },

    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Production optimizations
        if (!dev && !isServer) {
            // Remove console.logs in production
            config.optimization.minimizer.forEach((plugin) => {
                if (plugin.constructor.name === 'TerserPlugin') {
                    plugin.options.terserOptions.compress.drop_console = true;
                }
            });
        }

        return config;
    },

    // Output standalone for Docker/containerized deployments (optional)
    // output: 'standalone',

    // Experimental features (if needed)
    experimental: {
        // optimizeCss: true,
    },
};

module.exports = nextConfig;
