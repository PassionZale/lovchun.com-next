import type { CollectionEntry, InferEntrySchema } from "astro:content";

interface Column extends InferEntrySchema<"columns"> {
  /** 文章总数 */
  count: number;
}

const getUniqueColumns = (
  columns: CollectionEntry<"columns">[],
  posts: CollectionEntry<"blog">[]
) => {
  const columnsWithPostsCount: Column[] = columns
    .map(column => {
      const filters = posts.filter(
        ({ data }) => data.column === column.data.slug && !data.draft
      );

      return {
        ...column.data,
        count: filters.length,
      };
    })
    .filter(item => item.count > 0);

  return columnsWithPostsCount;
};

export default getUniqueColumns;

export type { Column };
