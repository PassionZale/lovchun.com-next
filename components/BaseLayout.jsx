export const BaseLayout = ({ children }) => {
  return (
    <div className="prose mx-auto max-w-screen-sm px-4 text-sm dark:prose-invert sm:px-6">
      {children}
    </div>
  )
}

export default BaseLayout
