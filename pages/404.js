import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto mt-20">
      <div className="flex max-w-2xl flex-col items-start justify-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
          404 – Page Not Found
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          你可能找到了曾经的页面或者访问了错误的链接地址，请仔细核查网址。
          <Link href="/">
            <a>返回首页</a>
          </Link>
        </p>
      </div>
    </div>
  )
}
