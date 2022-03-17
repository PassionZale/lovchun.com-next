import { useMDXComponent } from 'next-contentlayer/hooks'

import Link from './Link'
import Image from './Image'
import FrontMatter from './FrontMatter'
import Edit from './Edit'

export const MDXComponents = {
  a: Link,
  Image,
}

export const MDXLayoutRenderer = ({ mdxSource, mdxRemote, ...rest }) => {
  const Component = useMDXComponent(mdxSource)

  return (
    <article className="mb-10">
      <FrontMatter {...rest} />
      <Component components={MDXComponents} />
      <Edit link={mdxRemote} date={rest.frontMatter.updatedAt} />
    </article>
  )
}

export default MDXLayoutRenderer
