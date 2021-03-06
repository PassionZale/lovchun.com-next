import dynamic from 'next/dynamic'
import {
  RiHome3Fill,
  RiHistoryFill,
  RiQuestionFill,
  RiMailFill,
  RiRssFill,
  RiGithubFill,
} from 'react-icons/ri'

import ThemeSwitch from '@/components/ThemeSwitch'
import websiteConfigs from '@/configs/website.config'

const Link = dynamic(() => import('@/components/MDXComponents/Link'))

export const ICP = (props) => {
  return (
    <>
      {websiteConfigs.icp && (
        <Link
          title={websiteConfigs.icp}
          aria-label="icp"
          href={'https://beian.miit.gov.cn'}
          {...props}
        >
          {websiteConfigs.icp}
        </Link>
      )}
    </>
  )
}

export const Socials = () => {
  return (
    <div className="flex items-center space-x-2">
      {websiteConfigs.email && (
        <Link
          title="邮箱"
          aria-label="email"
          href={`mailto:${websiteConfigs.email}`}
        >
          <RiMailFill />
        </Link>
      )}

      {websiteConfigs.github && (
        <Link title="github" aria-label="github" href={websiteConfigs.github}>
          <RiGithubFill />
        </Link>
      )}

      <Link title="首页" aria-label="home" href={'/'}>
        <RiHome3Fill />
      </Link>

      <Link title="时间轴" aria-label="timeline" href={'/timeline'}>
        <RiHistoryFill />
      </Link>

      <Link title="关于" aria-label="about" href={'/about'}>
        <RiQuestionFill />
      </Link>

      <Link title="RSS" aria-label="rss" href={'/feed.xml'}>
        <RiRssFill />
      </Link>

      <ThemeSwitch />
    </div>
  )
}

export default Socials
