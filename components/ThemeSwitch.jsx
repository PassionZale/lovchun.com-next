import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div>
      The current theme is: {theme}
      <br />
      The resolvedTheme theme is: {resolvedTheme}
      <div style={{ color: resolvedTheme === 'dark' ? 'white' : 'black' }}>111</div>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <br />
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}

export default ThemeSwitch