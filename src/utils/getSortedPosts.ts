import type { CollectionEntry } from "astro:content";

export enum SortBy {
  /** 降序 */
  DESC = "descend",
  /** 升序 */
  ASC = "ascend",
}

const getSortedPosts = (posts: CollectionEntry<"blog">[], sortBy?: SortBy) => {
  return posts
    .filter(({ data }) => !data.draft)
    .sort((a, b) => {
      if (sortBy === SortBy.ASC) {
        return (
          Math.floor(
            new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
          ) -
          Math.floor(
            new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
          )
        );
      }

      return (
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
      );
    });
};

export default getSortedPosts;
