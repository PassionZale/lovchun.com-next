import rehypePrismPlus from 'rehype-prism-plus'
import nextMdx from '@next/mdx'
// import packages from './package.json'
import remarkPrism from 'remark-prism'

const isProd = process.env.NODE_ENV === 'production'
const cdnPrefix = process.env.CDN_PREFIX || ''

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkPrism, {
        plugins: [
          'line-numbers'
        ]
      }]
    ],
    // rehypePlugins: [[rehypePrismPlus, { ignoreMissing: true }]],
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  assetPrefix: isProd ? cdnPrefix : '',
  // env: {
  //   VERSION: packages.version,
  // },
}

export default withMDX(nextConfig)
