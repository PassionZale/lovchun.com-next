import Head from 'next/head'
import { useRouter } from 'next/router'

import websiteConfigs from '@/configs/website.config'

export const CommonSEO = ({ title, description, ogType, ogImage }) => {
  const router = useRouter()

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta name="robots" content="follow, index" />
      <meta name="google" content="notranslate" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta
        property="og:url"
        content={`${websiteConfigs.domain}${router.asPath}`}
      />
      <link href="/favicon.ico" rel="shortcut icon" />
    </Head>
  )
}

export const SiteSEO = () => {
  return (
    <CommonSEO
      title={websiteConfigs.title}
      description={websiteConfigs.description}
      ogType={'website'}
    />
  )
}

export const PageSEO = ({ title, summary, publishedAt, updatedAt }) => {
  const router = useRouter()
  const publishedTime = publishedAt
    ? new Date(publishedAt).toISOString()
    : undefined
  const modifiedAt = updatedAt || publishedAt
  const modifiedTime = modifiedAt
    ? new Date(modifiedAt).toISOString()
    : undefined

  return (
    <>
      <CommonSEO title={title} description={summary} ogType="article" />
      <Head>
        {publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        <link
          rel="canonical"
          href={`${websiteConfigs.domain}${router.asPath}`}
        />
      </Head>
    </>
  )
}
