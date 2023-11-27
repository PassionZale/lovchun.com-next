import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

import { CommonSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import Alert from '@/components/MDXComponents/DynamicComponents/Alert'
import PostItem from '@/components/PostItem'
import tagConfigs from '@/configs/tag.config'

const posts = allPosts
  .filter((post) => !post.draft)
  .sort((a, b) =>
    Number(new Date(a.publishedAt) - Number(new Date(b.publishedAt)))
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

      <Alert type="info" hidePrefix>
        <span className="mr-2 font-bold">#{tag.title}#</span> {tag.description}
        ，共{posts.length}篇文章。
      </Alert>

      <div className="mt-8">
        {posts.map((post) => (
          <PostItem key={post.slug} {...post} />
        ))}
      </div>

      <div className="border-t" />
    </>
  )
}

export default Page
