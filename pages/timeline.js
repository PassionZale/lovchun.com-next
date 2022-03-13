import { allTimeLines } from 'contentlayer/generated'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'

export const getStaticProps = () => {
  const [TimeLineMdx] = allTimeLines

  return { props: { post: TimeLineMdx } }
}

export const Page = ({ post }) => {
  const {
    frontMatter,
    readingTime,
    body: { code: mdxSource },
  } = post

  return (
    <>
      <PageSEO {...frontMatter} />

      <Profile />

      <MDXLayoutRenderer
        frontMatter={frontMatter}
        readingTime={readingTime}
        mdxSource={mdxSource}
      />
    </>
  )
}

export default Page