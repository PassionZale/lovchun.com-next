import Link from 'next/link'
import { RiArrowLeftCircleFill, RiArrowRightCircleFill } from 'react-icons/ri'

const Pagination = ({ previous, next }) => {
  if (!previous?.title && !next?.title) return null

  return (
    <div className="mt-10 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
      {previous?.title && (
        <Link href={`/posts/${previous?.slug}`} passHref>
          <button className="flex items-center border px-4 py-2 hover:text-slate-900 dark:hover:text-white">
            <RiArrowLeftCircleFill className="mr-3 overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            {previous?.title}
          </button>
        </Link>
      )}

      {next?.title && (
        <Link href={`/posts/${next?.slug}`} passHref>
          <button className="flex items-center border px-4 py-2 hover:text-slate-900 dark:hover:text-white">
            {next?.title}
            <RiArrowRightCircleFill className="ml-3 overflow-visible text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </button>
        </Link>
      )}
    </div>
  )
}

export default Pagination
