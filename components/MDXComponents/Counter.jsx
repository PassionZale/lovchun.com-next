import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const Counter = React.memo((props) => {
  const [counter, setCounter] = useState(null)

  useEffect(() => {
    const timmer = setInterval(() => {
      setCounter(() => {
        const startTime = dayjs(props.startTime)
        const duration = dayjs.duration(dayjs().diff(startTime))

        const years = duration.years()
        const months = duration.months()
        const days = duration.days()
        const hours = duration.hours()
        const minutes = duration.minutes()
        const seconds = duration.seconds()

        return {
          years,
          months,
          days,
          hours,
          minutes,
          seconds,
        }
      })
    }, 1000)

    return () => clearInterval(timmer)
  }, [props.startTime])

  return counter ? (
    <div className="inline-flex gap-2">
      {/* 年 */}
      {counter.years > 0 && (
        <div>
          <span className="font-mono text-xl">{counter.years}</span>
          years
        </div>
      )}

      {/* 月 */}
      {counter.months > 0 && (
        <div>
          <span className="font-mono text-xl">{counter.months}</span>
          months
        </div>
      )}

      {/* 天 */}
      <div>
        <span className="font-mono text-xl">
          {counter.days > 0 ? counter.days : 0}
        </span>
        days
      </div>

      {/* 时 */}
      <div>
        <span className="font-mono text-xl">
          {counter.hours > 0 ? counter.hours : 0}
        </span>
        hours
      </div>

      {/* 分 */}
      <div>
        <span className="font-mono text-xl">
          {counter.minutes > 0 ? counter.minutes : 0}
        </span>
        min
      </div>

      {/* 秒 */}
      <div>
        <span className="font-mono text-xl">
          {counter.seconds > 0 ? counter.seconds : 0}
        </span>
        sec
      </div>
    </div>
  ) : (
    <span className="font-mono">calculating...</span>
  )
})

Counter.displayName = 'Counter'

export default Counter
