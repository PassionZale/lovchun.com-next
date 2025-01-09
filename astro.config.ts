import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkGemoji from "remark-gemoji";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeUnwrapImages from "rehype-unwrap-images";
import rehypeFigure from "@microflash/rehype-figure";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import moonlightTheme from "./public/assets/moonlight-ii.json";

import type { RehypePlugins } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkToc, remarkGemoji],
    rehypePlugins: [
      rehypeUnwrapImages,
			// rehypeFigure,
      [
        rehypePrettyCode,
        {
          theme: moonlightTheme,
        },
      ],
      rehypeAccessibleEmojis,
    ] as unknown as RehypePlugins,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
