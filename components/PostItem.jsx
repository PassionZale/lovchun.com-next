import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { getDateString } from '@/lib/dataTransform'

export const PostItem = ({ title, publishedAt, slug, summary }) => {
  const router = useRouter()

  const handlePostTitleClick = useCallback(() => {
    router.push(`/posts/${slug}`)
  }, [router, slug])

  return (
    <div className="mb-10">
      <small dangerouslySetInnerHTML={{ __html: getDateString(publishedAt) }} />

      <h2
        className="mt-0 mb-2 cursor-pointer hover:underline hover:underline-offset-8"
        onClick={handlePostTitleClick}
      >
        {title}
      </h2>

      <p className="my-0">{summary}</p>
    </div>
  )
}

export default PostItem
