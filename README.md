# lovchun.com-next

## Frontmatter

| Property           | Description                                                                                 | Remark                                        |
| ------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **_title_**        | Title of the post. (h1)                                                                     | required<sup>\*</sup>                         |
| **_description_**  | Description of the post. Used in post excerpt and site description of the post.             | required<sup>\*</sup>                         |
| **_pubDatetime_**  | Published datetime in ISO 8601 format.                                                      | required<sup>\*</sup>                         |
| **_modDatetime_**  | Modified datetime in ISO 8601 format. (only add this property when a blog post is modified) | optional                                      |
| **_author_**       | Author of the post.                                                                         | default = SITE.author                         |
| **_slug_**         | Slug for the post. This field is optional but cannot be an empty string. (slug: ""❌)       | default = slugified file name                 |
| **_featured_**     | Whether or not display this post in featured section of home page                           | default = false                               |
| **_draft_**        | Mark this post 'unpublished'.                                                               | default = false                               |
| **_tags_**         | Related keywords for this post. Written in array yaml format.                               | default = others                              |
| **_ogImage_**      | OG image of the post. Useful for social media sharing and SEO.                              | default = SITE.ogImage or generated OG image  |
| **_canonicalURL_** | Canonical URL (absolute), in case the article already exists on other source.               | default = `Astro.site` + `Astro.url.pathname` |

```md
---
title:
description:
pubDatetime:
modDatetime:
postSlug:
featured: false
draft: false
tags:
  -
---

## Table of contents
```
