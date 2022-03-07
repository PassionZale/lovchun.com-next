import '@/styles/globals.css'
import '@/styles/prism.css'
import 'prism-themes/themes/prism-atom-dark.css'

import Head from 'next/head'
import BaseLayout from '@/components/BaseLayout'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
      </Head>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </>
  )
}

export default MyApp
