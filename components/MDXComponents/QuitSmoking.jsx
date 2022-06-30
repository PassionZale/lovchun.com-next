import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const THE_DAY_STOP_SMOKING = '2022-06-30 00:00:00'

const QuitSmoking = () => {
  const [counter, setCounter] = useState(null)

  useEffect(() => {
    const timmer = setInterval(() => {
      setCounter(() => {
        const startTime = dayjs(THE_DAY_STOP_SMOKING)
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
  }, [])

  return counter ? (
    <div className="flex gap-5">
      {/* 年 */}
      {counter.years > 0 && (
        <div>
          <span className="font-mono text-2xl">{counter.years}</span>
          years
        </div>
      )}

      {/* 月 */}
      {counter.months > 0 && (
        <div>
          <span className="font-mono text-2xl">{counter.months}</span>
          months
        </div>
      )}

      {/* 天 */}
      <div>
        <span className="font-mono text-2xl">
          {counter.days > 0 ? counter.days : 0}
        </span>
        days
      </div>

      {/* 时 */}
      <div>
        <span className="font-mono text-2xl">
          {counter.hours > 0 ? counter.hours : 0}
        </span>
        hours
      </div>

      {/* 分 */}
      <div>
        <span className="font-mono text-2xl">
          {counter.minutes > 0 ? counter.minutes : 0}
        </span>
        min
      </div>

      {/* 秒 */}
      <div>
        <span className="font-ßmono text-2xl">
          {counter.seconds > 0 ? counter.seconds : 0}
        </span>
        sec
      </div>
    </div>
  ) : null
}

export default QuitSmoking
