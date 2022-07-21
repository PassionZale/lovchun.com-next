import { allPosts } from 'contentlayer/generated'
import { pick } from '@contentlayer/client'

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

  const postsOfTag = posts
    .filter((post) => post.tags.indexOf(tag) > -1)
    .map((post) => {
      return pick(post, ['publishedAt', 'title', 'slug', 'summary'])
    })

  return {
    props: {
      posts: postsOfTag,
      key: params.slug,
    },
  }
}

export const Page = ({ posts }) => {
  return (
    <div>
      {posts.map((item) => (
        <div key={item.slug}>
          <h1>{item.title}</h1>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  )
}

export default Page
