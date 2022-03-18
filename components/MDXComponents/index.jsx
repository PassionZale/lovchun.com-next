import { useMDXComponent } from 'next-contentlayer/hooks'

import Link from './Link'
import Image from './Image'
import FrontMatter from './FrontMatter'
import Edit from './Edit'
import Pagination from './Pagination'

export const MDXComponents = {
  a: Link,
  Image,
}

export const MDXLayoutRenderer = ({
  mdxSource,
  mdxRemote,
  previous,
  next,
  ...rest
}) => {
  const Component = useMDXComponent(mdxSource)

  return (
    <article className="mb-10">
      <FrontMatter {...rest} />
      <Component components={MDXComponents} />
      <Edit link={mdxRemote} date={rest.frontMatter.updatedAt} />
      <Pagination previous={previous} next={next} />
    </article>
  )
}

export default MDXLayoutRenderer
