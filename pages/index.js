import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import Layout from '@/components/Layout'
import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

export function getStaticProps() {
  const posts = allPosts
    .map((post) => pick(post, ['slug', 'title', 'publishedAt', 'description']))
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )

  return { props: { posts } }
}

function PostCard(post) {
  return (
    <div>
      <time dateTime={post.publishedAt}>
        {format(parseISO(post.publishedAt), 'LLLL d, yyyy')}
      </time>
      <h2>
        <Link href={`/posts/${post.slug}`}>
          <a>{post.title}</a>
        </Link>
      </h2>
    </div>
  )
}

export default function Home({ posts }) {
  return (
    <Layout>
      <h1>Contentlayer Podcast Example</h1>

      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </Layout>
  )
}
