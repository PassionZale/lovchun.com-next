import getSortedPosts, { SortBy } from "./getSortedPosts";
import type { CollectionEntry } from "astro:content";
import type { Column } from "./getUniqueColumns";

const getPostsByColumn = (posts: CollectionEntry<"blog">[], column: Column) =>
  getSortedPosts(
    posts.filter(post => post.data.column === column.slug),
    SortBy.ASC
  );

export default getPostsByColumn;
