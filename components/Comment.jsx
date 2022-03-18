import { Giscus } from '@giscus/react'
import { useTheme } from 'next-themes'

import useMounted from '@/lib/hooks/useMounted'
import giscusConfigs from '@/configs/giscus.config'

const Comment = () => {
  const mounted = useMounted()
  const { resolvedTheme } = useTheme()

  if (!mounted) return null

  return <Giscus {...giscusConfigs} theme={resolvedTheme} />
}

export default Comment
