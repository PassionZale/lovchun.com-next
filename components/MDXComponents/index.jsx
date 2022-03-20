import { useMDXComponent } from 'next-contentlayer/hooks'

import Link from './Link'
import Image from './Image'
import FrontMatter from './FrontMatter'
import Edit from './Edit'
import Pagination from './Pagination'

export const DefaultMDXComponents = {
  a: Link,
  Image,
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
      <Component components={{ ...DefaultMDXComponents, ...mdxComponents }} />
      <Edit link={mdxRemote} date={rest.frontMatter.updatedAt} />
      <Pagination previous={previous} next={next} />
    </article>
  )
}

export default MDXLayoutRenderer
