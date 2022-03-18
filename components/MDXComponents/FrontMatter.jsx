import Tag from '@/components/Tag'
import { getDateString, msToString } from '@/lib/dataTransform'
import useMounted from '@/lib/hooks/useMounted'

const DisplayPublishDateAndReadingTime = ({ publishedAt, readTime }) => {
  return (
    <div className="mt-2 flex space-x-1 text-xs font-normal text-gray-500">
      <small dangerouslySetInnerHTML={{ __html: getDateString(publishedAt) }} />
      <span>•</span>
      <span>{msToString({ time: readTime })}</span>
    </div>
  )
}

const DisplayTags = ({ tags }) => {
  if (tags.length) {
    return (
      <div className="mt-2 flex space-x-2">
        {tags.map((item, index) => (
          <Tag key={index}>#{item}</Tag>
        ))}
      </div>
    )
  }

  return null
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

        <DisplayTags tags={frontMatter.tags} />
      </h1>
    </>
  )
}

export default FrontMatter
