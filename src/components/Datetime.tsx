import { LOCALE } from "@config";

interface DatetimeProps {
  pubDatetime: Date;
  modDatetime?: Date | null | undefined;
}

interface Props extends DatetimeProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className,
}: Props) {
  return (
    <div className={`flex items-center opacity-80 ${className}`}>
      {modDatetime ? (
        <span className={`${size === "sm" ? "text-sm" : "text-base"}`}>
          最近更新于：
        </span>
      ) : (
        <span className="sr-only">发布于：</span>
      )}
      <span className={`${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
        />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimeProps) => {
  const myDatetime = new Date(modDatetime ? modDatetime : pubDatetime);

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return <time dateTime={myDatetime.toISOString()}>{date}</time>;
};
