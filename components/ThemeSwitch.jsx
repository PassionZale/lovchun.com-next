import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri'

const ThemedIcon = () => {
  const { resolvedTheme } = useTheme()

  switch (resolvedTheme) {
    case 'light':
      return <RiSunLine />
    case 'dark':
      return <RiMoonClearLine />
    default:
      return (
        <NextImage
          src={
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
          }
          width={30}
          height={30}
        />
      )
  }
}

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
      <button
        className="font-semibold no-underline"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
        <h1 className="mb-0">
          <ThemedIcon />
        </h1>
      </button>
  )
}

export default ThemeSwitch
