import { MDXProvider } from '@mdx-js/react'
import MDXComponents from '@/components/MdxComponents'
import '@/styles/globals.css'


function MyApp({ Component, pageProps }) {
  return (
    <MDXProvider components={MDXComponents}>
      <Component {...pageProps} />
    </MDXProvider>
  )
}

export default MyApp
