import ScrollToTop from './ScrollToTop'
import Footer from './Footer'
import { AnalyticsWrapper } from './Analytics'

export const BaseLayout = ({ children }) => {
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <div className="prose mx-auto max-w-screen-md px-4 text-sm dark:prose-invert sm:px-6">
      {children}

      <AnalyticsWrapper />
      <Footer />
      {isProd ? <ScrollToTop /> : null}
    </div>
  )
}

export default BaseLayout
