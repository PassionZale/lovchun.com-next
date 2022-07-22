import Link from 'next/link'

import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { SiteSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import PostItem from '@/components/PostItem'

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

export const Page = ({ posts }) => {
  return (
    <>
      <SiteSEO />

      <header className="pt-10">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="font-semibold no-underline">
              <h2 className="my-0 flex items-center">
                Hi
                <span className="wave">👋</span>
              </h2>
            </a>
          </Link>
        </div>
      </header>

      <Profile />

      {posts.map((post) => (
        <PostItem key={post.slug} {...post} />
      ))}

      <div className="border-t" />
    </>
  )
}

export default Page
