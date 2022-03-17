import { allPosts } from 'contentlayer/generated'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'

export const getStaticPaths = async () => {
  return {
    paths: allPosts.map((post) => ({ params: { slug: post.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const post = allPosts.find((post) => post.slug === params.slug.join('/'))

  return { props: { post } }
}

export const Page = ({ post }) => {
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
        frontMatter={frontMatter}
        readingTime={readingTime}
        mdxSource={mdxSource}
        mdxRemote={remotePath}
      />
    </>
  )
}

export default Page
