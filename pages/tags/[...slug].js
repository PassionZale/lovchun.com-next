import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { CommonSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import PostItem from '@/components/PostItem'
import tagConfigs from '@/configs/tag.config'

const posts = allPosts
  .filter((post) => !post.draft)
  .sort((a, b) =>
    Number(new Date(b.publishedAt) - Number(new Date(a.publishedAt)))
  )

export const getStaticPaths = async () => {
  const allTagTitles = posts.reduce((acc, cur) => {
    return [...acc, ...cur.tags]
  }, [])

  const tagTitles = [...new Set(allTagTitles)]

  const tagSlugs = tagTitles.reduce((acc, cur) => {
    const found = tagConfigs.find((tag) => tag.title === cur)

    if (found) acc.push(found.slug)

    return acc
  }, [])

  return {
    paths: tagSlugs.map((slug) => ({ params: { slug: [slug] } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const [tagSlug] = params.slug

  const tag = tagConfigs.find((item) => item.slug === tagSlug)

  const postsOfTag = posts
    .filter((post) => post.tags.indexOf(tag.title) > -1)
    .map((post) => {
      return pick(post, ['publishedAt', 'title', 'slug', 'summary'])
    })

  return {
    props: {
      tag,
      posts: postsOfTag,
      key: params.slug,
    },
  }
}

export const Page = ({ tag, posts }) => {
  return (
    <>
      <CommonSEO {...tag} />

      <Profile />

      <div className="mb-10 flex items-center rounded-full bg-sky-400/10 py-1 px-3 text-xs font-medium leading-5 text-sky-600 hover:bg-sky-400/20 dark:text-sky-400">
        <span className="mr-2 font-bold">#{tag.title}#</span> 共{posts.length}
        篇文章
      </div>

      <blockquote>{tag.description}</blockquote>

      {posts.map((post) => (
        <PostItem key={post.slug} {...post} />
      ))}

      <div className="border-t" />
    </>
  )
}

export default Page
