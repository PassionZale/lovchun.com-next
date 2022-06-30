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
    <div className="relative overflow-x-auto rounded-md bg-base-300">
      <div
        className="preview min-h-[6rem]  min-w-[18rem] max-w-4xl flex-wrap items-center justify-center gap-2 overflow-x-hidden rounded-md border border-base-300 bg-base-200 bg-cover bg-top p-4"
        style={{ backgroundSize: '5px 5px' }}
      >
        <style jsx>{`
          .preview {
            background-image: radial-gradient(
              hsla(var(--bc) / 0.2) 0.5px,
              hsla(var(--b2) / 1) 0.5px
            );
          }
        `}</style>

        {/* 年 */}
        <div className="grid auto-cols-max grid-flow-col justify-center gap-5 text-center">
          {counter.years > 0 && (
            <div className="flex flex-col text-black">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': counter.years }} />
              </span>
              years
            </div>
          )}

          {/* 月 */}
          {counter.months > 0 && (
            <div className="flex flex-col text-black">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': counter.months }} />
              </span>
              months
            </div>
          )}

          {/* 日 */}
          {counter.days > 0 && (
            <div className="flex flex-col text-black">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': counter.days }} />
              </span>
              days
            </div>
          )}

          {/* 时 */}
          {counter.hours > 0 && (
            <div className="flex flex-col text-black">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': counter.hours }} />
              </span>
              hours
            </div>
          )}

          {/* 分 */}
          {counter.minutes > 0 && (
            <div className="flex flex-col text-black">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': counter.minutes }} />
              </span>
              min
            </div>
          )}

          {/* 秒 */}
          {counter.seconds > 0 && (
            <div className="flex flex-col text-black">
              <span className="countdown font-mono text-5xl">
                <span style={{ '--value': counter.seconds }} />
              </span>
              sec
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default QuitSmoking
