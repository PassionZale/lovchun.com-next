import { useMemo } from 'react'

import { msToString } from '@/lib/dataTransform'
import useMounted from '@/lib/hooks/useMounted'

const DisplayPublishDateAndReadingTime = ({ publishedAt, readTime }) => {
  const publishedTime = useMemo(() => new Date(publishedAt), [])

  if (`${publishedTime}` === 'Invalid Date') {
    return null
  }

  const publishedBeforeNow = Date.now() - publishedTime.getTime()

  return (
    <div className="flex mt-2 space-x-1 text-xs text-gray-500 font-normal">
      <span>{msToString({ time: publishedBeforeNow, suffix: '之前' })}</span>
      <span>•</span>
      <span>{msToString({ time: readTime })}</span>
    </div>
  )
}

export const FrontMatter = ({ frontMatter, readingTime }) => {
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <>
      <h1>
        <title className="block">{frontMatter.title}</title>
        <DisplayPublishDateAndReadingTime
          publishedAt={frontMatter.publishedAt}
          readTime={readingTime.time}
        />
      </h1>
    </>
  )
}

export default FrontMatter
