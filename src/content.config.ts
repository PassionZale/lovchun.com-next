import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      slug: z.string().optional().nullable(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
			toc: z.boolean().optional().default(true),
      column: z.string().optional().nullable(),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      editPost: z
        .object({
          disabled: z.boolean().optional(),
          url: z.string().optional(),
          text: z.string().optional(),
          appendFilePath: z.boolean().optional(),
        })
        .optional(),
    }),
});

const columns = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/columns" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    createDatetime: z.string().date(),
    status: z.string(),
  }),
});

const timelines = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/timelines" }),
  schema: z.object({
    id: z.number(),
    year: z.number(),
    stories: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    ),
  }),
});

export const collections = { blog, columns, timelines };
