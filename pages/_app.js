import '@/styles/globals.css'
import '@/styles/nprogress.css'
import '@/styles/prism.css'
import 'prism-themes/themes/prism-atom-dark.css'

import { useEffect } from 'react'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { IconContext } from 'react-icons'

import BaseLayout from '@/components/BaseLayout'

const App = ({ Component, pageProps }) => {
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

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
        defaultTheme="system"
        forcedTheme={Component.theme || undefined}
      >
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
