import { allTimeLines } from 'contentlayer/generated'

import { PageSEO } from '@/components/SEO'
import Profile from '@/components/Profile'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import TimeLine from '@/components/TimeLine'

const mdxComponents = {
  TimeLine,
}

export const getStaticProps = () => {
  const [TimeLineMdx] = allTimeLines

  return { props: { post: TimeLineMdx } }
}

export const Page = ({ post }) => {
  const {
    frontMatter,
    body: { code: mdxSource },
    remotePath,
  } = post

  return (
    <>
      <PageSEO {...frontMatter} />

      <Profile />

      <MDXLayoutRenderer
        mdxSource={mdxSource}
        mdxRemote={remotePath}
        mdxComponents={mdxComponents}
        frontMatter={frontMatter}
      />

      <div className="border-t" />
    </>
  )
}

export default Page
