import React, { useMemo } from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'

const Alert = (props) => {
  const title = useMemo(() => {
    switch (props.type) {
      case 'warning':
        return 'Warning'

      case 'danger':
        return 'Danger'

      case 'success':
        return 'Success'

      case 'info':
        return 'Info'

      default:
        return 'Tips'
    }
  }, [props.type])

  const cls = useMemo(() => {
    switch (props.type) {
      case 'warning':
        return 'text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800'

      case 'danger':
        return 'text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800'

      case 'success':
        return 'text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800'

      case 'info':
        return 'text-sky-800 border border-sky-300 rounded-lg bg-sky-50 dark:bg-gray-800 dark:text-sky-400 dark:border-sky-800'

      default:
        return 'text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
    }
  }, [props.type])

  return (
    <div className={`flex items-center p-4 text-sm ${cls}`} role="alert">
      <RiErrorWarningLine className={'me-3 inline h-4 w-4 flex-shrink-0'} />

      <div>
        {props.hidePrefix ? null : <span class="font-medium">{title}!&nbsp;</span>}
        {props.children}
      </div>
    </div>
  )
}

export default Alert
