import Link from 'next/link'
import Profile from '@/components/Profile'

export default function Header() {
  return (
    <>
      <nav className="my-10 sm:my-20">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="font-semibold no-underline">
              <h1 className="mb-0">Hi 👋</h1>
            </a>
          </Link>
        </div>
      </nav>

      <Profile />
    </>
  )
}
