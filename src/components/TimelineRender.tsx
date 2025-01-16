import type { CollectionEntry } from "astro:content";
import React from "react";

const Divider: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <div
    className={`mx-auto max-w-3xl px-0 ${hidden ? "invisible my-4" : "visible my-8"}`}
  >
    <hr className="border-skin-line" aria-hidden="true" />
  </div>
);

const Year: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4>{children}</h4>
);

const Story: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <div className="flex items-center px-4">
        <span className="sr-only">Check</span>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </g>
        </svg>
        <p className="my-4 font-bold">{title}</p>
      </div>
      <div className="ml-6">{children}</div>
    </>
  );
};

const TimelineRender: React.FC<{
  sourceData: CollectionEntry<"timelines">["data"][];
}> = ({ sourceData }) => {
  const { length } = sourceData;

  return (
    <>
      {sourceData.map(({ year, stories }, index) => {
        return (
          <div key={year}>
            <Year>{year}</Year>
            {stories.map(({ title, content }) => {
              return (
                <Story key={title} title={title}>
                  {content}
                </Story>
              );
            })}
            <Divider hidden={index === length - 1} />
          </div>
        );
      })}
    </>
  );
};

export default TimelineRender;
