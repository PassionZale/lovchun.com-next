import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCallback } from 'react'

import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { getDateString } from '@/lib/utils'
import { SiteSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { ICP } from '@/components/Contact'

export const getStaticProps = () => {
  const posts = allPosts
    .filter((post) => !post.draft)
    .map((post) => pick(post, ['publishedAt', 'title', 'slug', 'summary']))
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )

  return { props: { posts } }
}

const PostItem = ({ title, publishedAt, slug, summary }) => {
  const router = useRouter()

  const handlePostTitleClick = useCallback(() => {
    router.push(`/posts/${slug}`)
  }, [])

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

export const Page = ({ posts }) => {
  return (
    <>
      <SiteSEO />

      <header className="my-5 sm:mt-20 sm:mb-10">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="font-semibold no-underline">
              <h2 className="my-0">Hi 👋</h2>
            </a>
          </Link>
        </div>
      </header>

      <Profile />

      {posts.map((post) => (
        <PostItem key={post.slug} {...post} />
      ))}

      <ICP />
    </>
  )
}

export default Page