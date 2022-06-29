import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const QuitSmoking = () => {
  const startTime = dayjs('2022-06-01 12:00:00')

  const [time, setTime] = useState('')

  useEffect(() => {
    const timmer = setInterval(() => {
      setTime(() => {
        const diff = startTime.fromNow(true)

        return diff
      })
    }, 1000)

    return () => clearInterval(timmer)
  }, [startTime])

  return time ? time : '计算中...'
}

export default QuitSmoking
