import Document, { Html, Head, Main, NextScript } from 'next/document'
import websiteConfigs from '@/configs/website.config'

class MyDocument extends Document {
  render() {
    return (
      <Html lang={websiteConfigs.lang} className="scroll-smooth">
        <Head />
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
