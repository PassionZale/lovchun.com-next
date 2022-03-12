import { useEffect, useState, useCallback } from 'react'
import { RiArrowUpCircleFill } from 'react-icons/ri'
import smoothscroll from 'smoothscroll-polyfill'

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    smoothscroll.polyfill()

    const handleWindowScroll = () => {
      if (window.scrollY > 100) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleWindowScroll)

    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`fixed right-8 bottom-8 hidden ${
        visible ? 'md:flex' : 'md:hidden'
      }`}
    >
      <button onClick={handleScrollTop} aria-label="回到顶部" type="button">
        <RiArrowUpCircleFill className="h-10 w-10" />
      </button>
    </div>
  )
}

export default ScrollToTop
