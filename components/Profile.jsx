import Image from 'next/image'

import Socials from '@/components/Contact'
import websiteConfigs from '@/configs/website.config'

export const Profile = () => {
  return (
    <div className="my-10">
      <div className="flex">
        <div className="mr-4 h-10  w-10 overflow-hidden rounded-full">
          <Image
            src={websiteConfigs.avatar}
            alt={websiteConfigs.author}
            width={40}
            height={40}
          />
        </div>

        <div className="flex-1">
          <p className="my-0 font-bold">{websiteConfigs.author}</p>
          <p className="my-0 font-light">{websiteConfigs.description}</p>

          <div className="mt-2">
            <Socials />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
