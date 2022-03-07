import Link from 'next/link'
import Image from 'next/image'
import websiteConfigs from '@/configs/website.config'

export default function Profile() {
  return (
    <div className="mb-10">
      <div className="flex">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={websiteConfigs.avatar}
            alt={websiteConfigs.author}
            width={40}
            height={40}
          />
        </div>

        <div className="ml-2">
          <p className="my-0 font-bold">{websiteConfigs.author}</p>
          <p className="my-0 font-light">
            {websiteConfigs.description}
            <Link href="/" className="ml-2">
              <a>About me</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
