import dynamic from 'next/dynamic'
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
  Video,
}

export const loadDynamicComponents = (components) => {
  if (Array.isArray(components) && components.length) {
    const results = {}

    components.map((component) => {
      results[component] = dynamic(() =>
        import(`./DynamicComponents/${component}`)
      )
    })

    return results
  }

  return {}
}

export const MDXLayoutRenderer = ({
  mdxSource,
  mdxRemote,
  components = [],
  previous,
  next,
  ...rest
}) => {
  const Component = useMDXComponent(mdxSource)

  const DynamicComponents = loadDynamicComponents(components)

  return (
    <article className="mb-10">
      <FrontMatter {...rest} />
      <div className="min-h-[30rem]">
        <Component
          components={{
            ...DefaultMDXComponents,
            ...DynamicComponents,
          }}
        />
      </div>
      <Edit link={mdxRemote} date={rest.frontMatter.updatedAt} />
      <Pagination previous={previous} next={next} />
    </article>
  )
}

export default MDXLayoutRenderer
