import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { CommonSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import PostItem from '@/components/PostItem'
import TAGS from '@/configs/tags.config'

const posts = allPosts
  .filter((post) => !post.draft)
  .sort((a, b) =>
    Number(new Date(a.publishedAt) - Number(new Date(b.publishedAt)))
  )

export const getStaticPaths = async () => {
  const allTags = posts.reduce((acc, cur) => {
    return [...acc, ...cur.tags]
  }, [])

  const tags = [...new Set(allTags)]

  return {
    paths: tags.map((tag) => ({ params: { slug: [tag] } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const [tag] = params.slug

  const metaData = TAGS.find((item) => item.title === tag)

  const postsOfTag = posts
    .filter((post) => post.tags.indexOf(tag) > -1)
    .map((post) => {
      return pick(post, ['publishedAt', 'title', 'slug', 'summary'])
    })

  return {
    props: {
      tag,
      metaData,
      posts: postsOfTag,
      key: params.slug,
    },
  }
}

export const Page = ({ tag, metaData, posts }) => {
  return (
    <>
      <CommonSEO {...metaData} />

      <Profile />

      <div className="mb-10 flex items-center rounded-full bg-sky-400/10 py-1 px-3 text-xs font-medium leading-5 text-sky-600 hover:bg-sky-400/20 dark:text-sky-400">
        <span className="mr-2 font-bold">#{tag}#</span> 共{posts.length}篇文章
      </div>

      <blockquote>{metaData.description}</blockquote>

      {posts.map((post) => (
        <PostItem key={post.slug} {...post} />
      ))}

      <div className="border-t" />
    </>
  )
}

export default Page
