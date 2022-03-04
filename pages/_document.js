import Document, { Html, Head, Main, NextScript } from 'next/document'
import websiteConfigs from '@/configs/website.config'

class MyDocument extends Document {
  render() {
    return (
      <Html lang={websiteConfigs.lang} className="scroll-smooth">
        <Head>
          <meta name="google" content="notranslate" />
          <meta name="theme-color" content="#000000" />
          {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"></link> */}
        </Head>
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                  } else {
                    document.documentElement.classList.remove('dark')
                  }
                  
                  localStorage.theme = 'light'
                  
                  localStorage.theme = 'dark'
                  
                  localStorage.removeItem('theme')
                })()
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
