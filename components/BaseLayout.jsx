import Footer from '@/components/Footer'

export default function BaseLayout({ children }) {
  return (
    <div className="prose text-sm dark:prose-invert mx-auto max-w-screen-md px-4 sm:px-6">
      {children}

      <Footer />
    </div>
  )
}
