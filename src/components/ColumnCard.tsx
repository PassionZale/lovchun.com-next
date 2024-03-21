import type { Column } from "@utils/getUniqueColumns";

interface Props extends Column {}

export default function GithubRepoCard({
  title,
  description,
  createDatetime,
  count,
  slug,
}: Props) {
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
        <div className="mt-auto opacity-80 text-sm">
          创建于&nbsp;{createDatetime}，共&nbsp;{count}&nbsp;篇文章
        </div>
      </a>
    </div>
  );
}
