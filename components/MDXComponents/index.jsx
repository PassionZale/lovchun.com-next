import { useMDXComponent } from 'next-contentlayer/hooks'

import Link from './Link'
import Image from './Image'
import FrontMatter from './FrontMatter'

export const MDXComponents = {
  a: Link,
  Image,
}

export const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
  const Component = useMDXComponent(mdxSource)

  return (
    <article className='mb-10'>
      <FrontMatter {...rest} />
      <Component components={MDXComponents} />
    </article>
  )
}

export default MDXLayoutRenderer
