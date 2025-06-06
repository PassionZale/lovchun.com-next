import type { Column } from "@utils/getUniqueColumns";

export default function GithubRepoCard({
  title,
  description,
  createDatetime,
  status,
  count,
  slug,
}: Column) {
  return (
    <div className="flex h-full flex-col rounded border-2 border-skin-fill/50 p-4 transition-all hover:scale-[1.01] hover:bg-skin-card-muted/40">
      <a
        href={`/columns/${slug}`}
        rel="noreferrer"
        className="cursor-pointer font-medium"
      >
        <div className="flex items-center text-lg text-skin-accent">
          <span className="text-skin-accent">{title}</span>
        </div>
        <div className="mb-4 mt-2">{description}</div>
        <div className="mt-auto text-sm opacity-80">
          创建于&nbsp;{createDatetime}，共&nbsp;{count}&nbsp;篇文章。
          <span className="rounded bg-skin-accent px-2.5 py-0.5 text-xs text-white">
            {status}
          </span>
        </div>
      </a>
    </div>
  );
}
