import '@/styles/globals.css'
import '@/styles/prism.css'
import 'prism-themes/themes/prism-atom-dark.css'

import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import BaseLayout from '@/components/BaseLayout'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, minimum-scale=1, viewport-fit=cover"
        />
      </Head>
      <ThemeProvider
        attribute="class"
        forcedTheme={Component.theme || null}
      >
        <BaseLayout>
          <Component {...pageProps} />
        </BaseLayout>
      </ThemeProvider>
    </>
  )
}

export default MyApp
