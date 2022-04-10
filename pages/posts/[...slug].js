import fs from 'fs'
import { InView } from 'react-intersection-observer'
import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import Comment from '@/components/Comment'
import generateRss from '@/lib/generateRss'

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

  const previousPost = posts[foundIndex - 1]
  const post = posts[foundIndex]
  const nextPost = posts[foundIndex + 1]

  // https://nextjs.org/docs/messages/large-page-data
  const previous = previousPost ? pick(previousPost, ['slug', 'title']) : null
  const next = nextPost ? pick(nextPost, ['slug', 'title']) : null

  // rss
  const rss = generateRss(posts)
  fs.writeFileSync('./public/feed.xml', rss)

  return { props: { previous, post, next, key: params.slug } }
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

      <InView rootMargin="140px" triggerOnce fallbackInView>
        {({ inView, ref }) => (
          <div id="comments" ref={ref}>
            {inView && <Comment title={frontMatter.title} />}
          </div>
        )}
      </InView>
    </>
  )
}

export default Page
