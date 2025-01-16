import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

export enum SortBy {
  DESC = "descend",
  ASC = "ascend",
}

const getSortedPosts = (posts: CollectionEntry<"blog">[], sortBy?: SortBy) => {
  return posts.filter(postFilter).sort((a, b) => {
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
