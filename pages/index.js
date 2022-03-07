import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'
import Header from '@/components/Header'
import { SiteSEO } from '@/components/SEO'

export function getStaticProps() {
  const posts = allPosts
    .filter((post) => !post.draft)
    .map((post) => pick(post, ['publishedAt', 'title', 'slug', 'frontMatter']))
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    )

  return { props: { posts } }
}

function PostItem(post) {
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
    <>
      <SiteSEO />

      <Header />

      <div className="">
        {posts.map((post, idx) => (
          <PostItem key={idx} {...post} />
        ))}
      </div>
    </>
  )
}
