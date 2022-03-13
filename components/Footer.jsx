import Image from 'next/image'
import getConfig from 'next/config'

import { ICP } from '@/components/Contact'

const { publicRuntimeConfig } = getConfig()

const Footer = () => {
  return (
    <footer className="flex items-center space-x-1 border-t py-5 text-xs font-normal text-gray-500">
      <Image
        src="/static/favicons/apple-touch-icon.png"
        width={24}
        height={24}
      />
      <span className="">&copy;</span>
      <span>{new Date().getFullYear()}</span>
      <button className="rounded-full bg-cyan-500 px-2 font-semibold text-white shadow-sm">
        v{publicRuntimeConfig.version}
      </button>
      <ICP className="text-xs text-gray-500" />
    </footer>
  )
}

export default Footer
