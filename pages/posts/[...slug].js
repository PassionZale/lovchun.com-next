import { allPosts } from 'contentlayer/generated'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'

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

  const previous = posts[foundIndex - 1] || null

  const post = posts[foundIndex]

  const next = posts[foundIndex + 1] || null

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
    </>
  )
}

export default Page
