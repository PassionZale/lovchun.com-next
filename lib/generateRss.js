import { escape } from '@/lib/htmlEscaper'

import websiteConfigs from '@/configs/website.config'

const generateRssItem = (post) => `
  <item>
    <guid>${websiteConfigs.domain}/posts/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${websiteConfigs.domain}/posts/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <author>${websiteConfigs.email} (${websiteConfigs.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(websiteConfigs.title)}</title>
      <link>${websiteConfigs.domain}</link>
      <description>${escape(websiteConfigs.description)}</description>
      <language>${websiteConfigs.lang}</language>
      <managingEditor>${websiteConfigs.email} (${websiteConfigs.author})</managingEditor>
      <webMaster>${websiteConfigs.email} (${websiteConfigs.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].updatedAt).toUTCString()}</lastBuildDate>
      <atom:link href="${websiteConfigs.domain}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`
export default generateRss
