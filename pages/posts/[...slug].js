import { format, parseISO } from 'date-fns'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { allPosts } from 'contentlayer/generated'
import Layout from '@/components/Layout'

export async function getStaticPaths() {
  return {
    paths: allPosts.map((post) => ({ params: { slug: post.slug.split('/') } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post.slug === params.slug.join('/'))

  return { props: { post } }
}

export default function Page({ post }) {
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
