const isProd = process.env.NODE_ENV === 'production'
const cdnPrefix = process.env.CDN_PREFIX || ''


const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // assetPrefix: isProd ? cdnPrefix : '',
  env: {
    VERSION: require('./package.json').version,
  },
}

module.exports = withMDX(nextConfig)