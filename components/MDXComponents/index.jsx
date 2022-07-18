import { useMDXComponent } from 'next-contentlayer/hooks'

import Link from './Link'
import Image from './Image'
import Video from './Video'
import FrontMatter from './FrontMatter'
import Edit from './Edit'
import Pagination from './Pagination'

export const DefaultMDXComponents = {
  a: Link,
  Image,
  Video
}

export const MDXLayoutRenderer = ({
  mdxSource,
  mdxRemote,
  mdxComponents = {},
  previous,
  next,
  ...rest
}) => {
  const Component = useMDXComponent(mdxSource)

  return (
    <article className="mb-10">
      <FrontMatter {...rest} />
      <div className="min-h-[30rem]">
        <Component components={{ ...DefaultMDXComponents, ...mdxComponents }} />
      </div>
      <Edit link={mdxRemote} date={rest.frontMatter.updatedAt} />
      <Pagination previous={previous} next={next} />
    </article>
  )
}

export default MDXLayoutRenderer
