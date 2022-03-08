import { useMDXComponent } from 'next-contentlayer/hooks'
import Link from './Link'
import Image from './Image'

export const MDXComponents = {
  a: Link,
  Image,
}

export const MDXLayoutRenderer = ({ mdxSource }) => {
  const Component = useMDXComponent(mdxSource)

  return <Component components={MDXComponents} />
}

export default MDXComponents
