const Divider = () => {
  return (
    <div className="my-8 w-full border-t border-gray-200 dark:border-gray-600" />
  )
}

const Year = ({ children }) => {
  return <h4>{children}</h4>
}

const Story = ({ title, children }) => {
  return (
    <>
      <div className="flex items-center text-green-700 dark:text-green-300">
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
        <p className="my-4 font-bold text-gray-900 dark:text-gray-100">
          {title}
        </p>
      </div>
      <div className="ml-6 text-gray-700 dark:text-gray-400">{children}</div>
    </>
  )
}

export default function Timeline({ sourceData }) {
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
              )
            })}
            {index !== length - 1 && <Divider />}
          </div>
        )
      })}
    </>
  )
}
