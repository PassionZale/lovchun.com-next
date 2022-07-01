import Image from 'next/image'
import getConfig from 'next/config'

import { ICP } from '@/components/Contact'
import Tag from '@/components/Tag'

const { publicRuntimeConfig } = getConfig()

const Footer = () => {
  return (
    <footer className="flex items-center space-x-1 py-5 text-xs font-normal text-gray-500">
      <Image
        src="/static/favicons/apple-touch-icon.png"
        alt={'icon'}
        width={24}
        height={24}
      />
      <span className="">&copy;</span>
      <span>{new Date().getFullYear()}</span>
      <Tag>v{publicRuntimeConfig.version}</Tag>
      <ICP className="text-xs text-gray-500" />
    </footer>
  )
}

export default Footer
