import Document, { Html, Head, Main, NextScript } from 'next/document'
import websiteConfigs from '@/configs/website.config'

class MyDocument extends Document {
  render() {
    return (
      <Html lang={websiteConfigs.lang} className="scroll-smooth">
        <Head>
          <meta name="theme-color" content="#000000" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
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
