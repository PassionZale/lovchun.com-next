import React, { useMemo } from 'react'
import Link from 'next/link'
import { RiEdit2Fill } from 'react-icons/ri'

import { msToString } from '@/lib/dataTransform'

const Edit = React.memo(({ link, date }) => {
  const time = useMemo(() => new Date(date), [date])

  if (`${time}` === 'Invalid Date') {
    return null
  }

  const timeBeforeNow = Date.now() - time.getTime()

  const linkTitle = '编辑此页'

  return (
    <div className="mt-10 flex items-center justify-between">
      <Link href={link}>
        <a
          title={linkTitle}
          target="_blank"
          rel="noreferrer"
          className="flex items-center"
        >
          <RiEdit2Fill />
          <span className="ml-2">{linkTitle}</span>
        </a>
      </Link>

      <div>最后更新于{msToString({ time: timeBeforeNow, suffix: '之前' })}</div>
    </div>
  )
})

Edit.displayName = 'Edit'

export default Edit
