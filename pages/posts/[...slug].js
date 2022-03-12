import { allPosts } from 'contentlayer/generated'

import Layout from '@/components/Layout'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { getDateString } from '@/lib/utils'

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

export const _Page = ({ post }) => {
  return (
    <Layout meta={{ title: post.title }}>
      <h1>{post.title}</h1>
      {post.publishedAt && (
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
      )}

      <p>
        {post.readingTime.text} {post.wordCount}字数
      </p>
      <MDXLayoutRenderer mdxSource={post.body.code} />
    </Layout>
  )
}

export const Page = ({ post }) => {
  const {
    frontMatter,
    frontMatter: { title, publishedAt, updatedAt, summary },
    readingTime: { minutes },
    body: { code: mdxSource },
  } = post

  return (
    <>
      <PageSEO {...frontMatter} />

      <Profile />

      <h1>{title}</h1>

      <MDXLayoutRenderer mdxSource={mdxSource} />
    </>
  )
}

export default Page
