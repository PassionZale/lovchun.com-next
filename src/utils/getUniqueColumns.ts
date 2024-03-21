import type { CollectionEntry } from "astro:content";

interface Column {
  title: string;
  description: string;
  createDatetime: string;
  slug: string;
  count: number;
}

const getUniqueColumns = (
  columnEntry: CollectionEntry<"schema">,
  posts: CollectionEntry<"blog">[]
) => {
  const columns: Column[] = Object.keys(columnEntry.data)
    .map(key => {
      const filters = posts.filter(
        ({ data }) => data.column === key && !data.draft
      );

      return {
        ...columnEntry.data[key],
        slug: key,
        count: filters.length,
      };
    })
    .filter(item => item.count);

  return columns;
};

export default getUniqueColumns;

export type { Column }
