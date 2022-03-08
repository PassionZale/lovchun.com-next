import Link from '@/components/MDXComponents/Link'
import websiteConfigs from '@/configs/website.config'

export default function Footer() {
  return (
    <>
      <footer className="flex items-center">
        <Link href="https://beian.miit.gov.cn">
          <a>
            粤ICP备16020962号-1
          </a>
        </Link>

        <Link href={`mail:${websiteConfigs.email}`}>
          <a>
            Email
          </a>
        </Link>

        <Link href={websiteConfigs.github}>
          <a>
            Github
          </a>
        </Link>
      </footer>
    </>
  )
}
