import { allAbouts } from 'contentlayer/generated'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'

export const getStaticProps = () => {
  const [AboutMdx] = allAbouts

  return { props: { post: AboutMdx } }
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