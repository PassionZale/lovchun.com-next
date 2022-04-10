import { memo } from 'react'
import { Giscus } from '@giscus/react'
import { useTheme } from 'next-themes'

import useMounted from '@/lib/hooks/useMounted'
import giscusConfigs from '@/configs/giscus.config'

const WrapperStyles = {
  marginTop: '2em',
  paddingTop: '2em',
  minHeight: '200px',
}

const Comment = ({ title }) => {
  const mounted = useMounted()
  const { resolvedTheme } = useTheme()

  if (!mounted) return null

  return (
    <div style={WrapperStyles}>
      <Giscus {...giscusConfigs} term={title} theme={resolvedTheme} />
    </div>
  )
}

export default memo(Comment)
