import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from './Image'
import Link from './Link'

export const MDXComponents = {
  a: Link,
  Image,
}

export const MDXLayoutRenderer = ({ mdxSource }) => {
  const Component = useMDXComponent(mdxSource)

  return <Component components={MDXComponents} />
}

export default MDXComponents
