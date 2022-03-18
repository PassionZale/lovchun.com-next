import Link from 'next/link'
import { RiArrowLeftCircleFill, RiArrowRightCircleFill } from 'react-icons/ri'

const Pagination = ({ previous, next }) => {
  if (!previous && !next) return null

  return (
    <div className="mt-10 flex items-center justify-between space-x-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
      <div
        className={`flex w-full justify-start ${
          previous ? 'visible' : 'invisible'
        }`}
      >
        <Link href={`/posts/${previous?.slug}`} passHref>
          <button className="group flex items-center hover:text-slate-900 dark:hover:text-white">
            <RiArrowLeftCircleFill className="mr-3 overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            {previous?.title}
          </button>
        </Link>
      </div>

      <div
        className={`flex w-full justify-end ${next ? 'visible' : 'invisible'}`}
      >
        <Link href={`/posts/${next?.slug}`} passHref>
          <button className="group flex items-center hover:text-slate-900 dark:hover:text-white">
            {next?.title}
            <RiArrowRightCircleFill className="ml-3 overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Pagination
