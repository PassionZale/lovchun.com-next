import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import Comment from '@/components/Comment'

const posts = allPosts
  .filter((post) => !post.draft)
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  )

export const getStaticPaths = async () => {
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const foundIndex = posts.findIndex(
    (post) => post.slug === params.slug.join('/')
  )

  // https://nextjs.org/docs/messages/large-page-data
  const previous = pick(posts[foundIndex - 1], ['slug', 'title']) || null

  const post = posts[foundIndex]

  const next = pick(posts[foundIndex + 1], ['slug', 'title']) || null

  return { props: { previous, post, next } }
}

export const Page = ({ previous, post, next }) => {
  const {
    frontMatter,
    readingTime,
    body: { code: mdxSource },
    remotePath,
  } = post

  return (
    <>
      <PageSEO {...frontMatter} />

      <Profile />

      <MDXLayoutRenderer
        mdxSource={mdxSource}
        mdxRemote={remotePath}
        previous={previous}
        next={next}
        frontMatter={frontMatter}
        readingTime={readingTime}
      />

      <Comment />
    </>
  )
}

export default Page
