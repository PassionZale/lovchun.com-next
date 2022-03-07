import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrismPlus from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', description: '标题', required: true },
    createdAt: { type: 'date', description: '创建时间', required: true },
    publishedAt: { type: 'date', description: '发布时间', default: null },
    updatedAt: { type: 'date', description: '最后更新时间', default: null },
    draft: {
      type: 'boolean',
      description: '是否为草稿, 草稿不会被展示',
      default: true,
    },
    summary: { type: 'string', description: '概括', default: null },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: '标签',
      required: true,
    },
  },
  computedFields: {
    frontMatter: {
      type: 'object',
      resolve: ({
        title,
        createdAt,
        publishedAt,
        updatedAt,
        draft,
        summary,
        tags,
      }) => ({
        title,
        createdAt,
        publishedAt,
        updatedAt,
        draft,
        summary,
        tags,
      }),
    },

    readingTime: {
      type: 'json',
      resolve: (doc) => readingTime(doc.body.raw),
    },

    wordCount: {
      type: 'number',
      resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
    },

    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, ''),
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
        },
      ],
      rehypeCodeTitles,
      [
        rehypePrismPlus,
        {
          ignoreMissing: true,
          showLineNumbers: false,
        },
      ],
      rehypeAccessibleEmojis,
    ],
  },
})
