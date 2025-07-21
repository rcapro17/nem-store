/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  // NOVO: Configuração experimental para melhor standalone
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "./"),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nem.com.br",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    unoptimized: process.env.DOCKER_ENV === "true",
  },

  async redirects() {
    return [
      {
        source: "/shop/:path*",
        destination: "/products/:path*",
        permanent: true,
      },
      {
        source: "/produto/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/loja",
        destination: "/products",
      },
      {
        source: "/carrinho",
        destination: "/cart",
      },
      {
        source: "/finalizar-compra",
        destination: "/checkout",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
      // NOVO: Cache otimizado para assets estáticos
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  compress: true,
  trailingSlash: false,
  poweredByHeader: false,

  serverExternalPackages: [
    "@prisma/client",
    "@woocommerce/woocommerce-rest-api",
  ],
};

module.exports = nextConfig;
