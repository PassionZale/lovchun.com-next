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
    remotePath,
    components,
  } = post

  return (
    <>
      <PageSEO {...frontMatter} />

      <Profile />

      <MDXLayoutRenderer
        mdxSource={mdxSource}
        mdxRemote={remotePath}
        components={components}
        frontMatter={frontMatter}
        readingTime={readingTime}
      />

      <div className="border-t" />
    </>
  )
}

export default Page
