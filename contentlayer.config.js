import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import remarkGfm from 'remark-gfm'
import remarkGemoji from 'remark-gemoji'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrismPlus from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import websiteConfigs from './configs/website.config'

const CommonFields = {
  title: { type: 'string', description: '标题', required: true },
  createdAt: { type: 'date', description: '创建时间', required: true },
  publishedAt: { type: 'date', description: '发布时间', default: null },
  updatedAt: { type: 'date', description: '最后更新时间', default: null },
  toc: {
    type: 'boolean',
    description: '是否展示 TableOfContents',
    default: false,
  },
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
}

const CommonComputedFields = {
  frontMatter: {
    type: 'object',
    resolve: ({
      title,
      createdAt,
      publishedAt,
      updatedAt,
      toc,
      draft,
      summary,
      tags,
    }) => ({
      title,
      createdAt,
      publishedAt,
      updatedAt,
      toc,
      draft,
      summary,
      tags,
    }),
  },

  readingTime: {
    type: 'json',
    resolve: (doc) => readingTime(doc.body.raw),
  },

  remotePath: {
    type: 'string',
    resolve: (doc) =>
      `${websiteConfigs.repo}/edit/main/data/${doc._raw.sourceFilePath}`,
  },
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/*.mdx',
  contentType: 'mdx',
  fields: CommonFields,
  computedFields: {
    ...CommonComputedFields,
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, ''),
    },
  },
}))

export const About = defineDocumentType(() => ({
  name: 'About',
  filePathPattern: 'about.mdx',
  contentType: 'mdx',
  fields: CommonFields,
  computedFields: {
    ...CommonComputedFields,
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export const TimeLine = defineDocumentType(() => ({
  name: 'TimeLine',
  filePathPattern: 'timeline.mdx',
  contentType: 'mdx',
  fields: CommonFields,
  computedFields: {
    ...CommonComputedFields,
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Post, About, TimeLine],
  mdx: {
    remarkPlugins: [remarkGfm, remarkGemoji],
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
