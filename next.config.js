const { withContentlayer } = require('next-contentlayer')
const packages = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'
const cdnPrefix = process.env.CDN_PREFIX || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: isProd,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  assetPrefix: isProd ? cdnPrefix : '',
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    version: packages.version,
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = withContentlayer()(nextConfig)
