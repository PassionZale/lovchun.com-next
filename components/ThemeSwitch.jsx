import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { RiSunFill, RiMoonClearFill } from 'react-icons/ri'

const ThemedIcon = () => {
  const { resolvedTheme } = useTheme()

  switch (resolvedTheme) {
    case 'light':
      return <RiSunFill />
    case 'dark':
      return <RiMoonClearFill />
    default:
      return (
        <NextImage
          src={
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
          }
          width={16}
          height={16}
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
      type="button"
      title='切换主题'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <ThemedIcon />
    </button>
  )
}

export default ThemeSwitch
