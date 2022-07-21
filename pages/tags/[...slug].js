import { allPosts } from 'contentlayer/generated'

import MDXLayoutRenderer from '@/components/MDXComponents'
import Profile from '@/components/Profile'
import { CommonSEO } from '@/components/SEO'

const posts = allPosts
  .filter((post) => !post.draft)
  .sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
  )

export const getStaticPaths = async () => {
  const tags = posts.reduce((acc, cur) => {
    cur.tags

    return acc
  }, [])

  return {
    paths: tags.map((tag) => ({ params: { slug: tag.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const tag = tags.find((item) => item.slug === params.slug.join('/'))

  console.log(tag)

  return {
    props: {
      tag,
      key: params.slug,
    },
  }
}

export const Page = ({ tag }) => {
  const {
    frontMatter,
    body: { code: mdxSource },
  } = tag

  return (
    <>
      <CommonSEO {...frontMatter} />

      <Profile />

      <MDXLayoutRenderer mdxSource={mdxSource} frontMatter={frontMatter} />
    </>
  )
}

export default Page
