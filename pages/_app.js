import '@/styles/globals.css'
import '@/styles/prism.css'
import 'prism-themes/themes/prism-atom-dark.css'

import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { IconContext } from 'react-icons'

import BaseLayout from '@/components/BaseLayout'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, minimum-scale=1, viewport-fit=cover"
        />
      </Head>
      <ThemeProvider attribute="class" forcedTheme={Component.theme || null}>
        <IconContext.Provider value={{ className: 'icon' }}>
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </IconContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default App
