import { useRouter } from 'next/router'

import Tag from '@/components/Tag'
import { getDateString, msToString } from '@/lib/dataTransform'
import useMounted from '@/lib/hooks/useMounted'
import tagConfigs from '@/configs/tag.config'

const DisplayPublishDateAndReadingTime = ({ publishedAt, readTime }) => {
  return (
    <div className="mt-2 flex space-x-1 text-xs font-normal text-gray-500">
      <span dangerouslySetInnerHTML={{ __html: getDateString(publishedAt) }} />
      {readTime && (
        <>
          <span>•</span>
          <span>{msToString({ time: readTime })}</span>
        </>
      )}
    </div>
  )
}

const DisplayTags = ({ tags }) => {
  const router = useRouter()

  const getTagSlug = (tagTitle) => {
    const found = tagConfigs.find((item) => item.title === tagTitle)

    return found?.slug
  }

  if (tags.length) {
    return (
      <div className="mt-2 flex space-x-2">
        {tags.map((title, index) => {
          const slug = getTagSlug(title)

          if (slug) {
            return (
              <Tag onClick={() => router.push(`/tags/${slug}`)} key={index}>
                #{title}#
              </Tag>
            )
          } else {
            return null
          }
        })}
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
          readTime={readingTime?.time}
        />

        <DisplayTags tags={frontMatter.tags} />
      </h1>
    </>
  )
}

export default FrontMatter
