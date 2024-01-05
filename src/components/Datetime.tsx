import { LOCALE } from "@config";

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined;
}

interface Props extends DatetimesProps {
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
          最近更新于:
        </span>
      ) : (
        <span className="sr-only">发布于:</span>
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

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimesProps) => {
  const myDatetime = new Date(modDatetime ? modDatetime : pubDatetime);

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE.langTag, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
      {/* <span aria-hidden="true"> | </span>
      <span className="sr-only">&nbsp;at&nbsp;</span>
      <span className="text-nowrap">{time}</span> */}
    </>
  );
};
