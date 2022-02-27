import Head from 'next/head'
import Link from 'next/link'

const defaultMeta = {
  title: 'Lei Zhangle',
  publishedAt: '',
  description: 'personal website',
  cover: '',
}

export default function Layout({ meta = {}, children }) {
  const metaData = { ...meta, ...defaultMeta }

  return (
    <>
      <Head>
        <title>{metaData.title}</title>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content="description" name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:title" content={metaData.title} />
        <meta property="og:image" content={metaData.cover} />
      </Head>
      <nav>
        <a href="#skip" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <div className="mx-2 flex items-center justify-between p-8">
          <Link href="/">
            <a className="invisible font-semibold no-underline sm:visible">
              <h1>{meta.title}</h1>
            </a>
          </Link>
          <ul className="flex items-center justify-between space-x-4">
            <li>
              <div className="relative inline-block w-32">
                <select
                  onChange={() => console.log(11)}
                  value="tomorrow"
                  className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none"
                >
                  <option value="okaidia">Okaidia</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="coy">Coy</option>
                  <option value="funky">Funky</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/leerob/nextjs-prism-markdown"
                className="font-semibold text-gray-700 no-underline"
              >
                Source
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div id="skip">
        <article className="prose m-auto my-4 px-8 sm:my-16">
          {children}
        </article>
      </div>
    </>
  )
}
