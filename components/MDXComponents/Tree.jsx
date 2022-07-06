import React, { useMemo, useState } from 'react'
import {
  DiHtml5,
  DiSass,
  DiJavascript1,
  DiGulp,
  DiNpm,
  DiAptana,
  DiEnvato,
  DiGit,
  DiMarkdown,
} from 'react-icons/di'
import {
  VscFolder,
  VscFolderOpened,
  VscFileCode,
  VscJson,
} from 'react-icons/vsc'
import { generateUnid } from '@/lib/dataTransform'

const FILE_ICONS = {
  js: <DiJavascript1 className="text-yellow-500" />,
  wxml: <DiHtml5 className="text-amber-500" />,
  scss: <DiSass className="text-red-500" />,
  json: <VscJson className="text-yellow-500" />,
  gulp: <DiGulp className="text-red-500" />,
  npm: <DiNpm className="text-red-500" />,
  env: <DiEnvato className="text-emerald-500" />,
  git: <DiGit />,
  config: <DiAptana className="text-blue-500" />,
  md: <DiMarkdown />,
  default: <VscFileCode />,
}

const Help = ({ children }) => {
  return children ? (
    <span className="pl-2 select-none text-xs italic text-[#7c7c7c] underline">
      {children}
    </span>
  ) : null
}

const File = ({ name, help, disabled, icon }) => {
  const ext = icon || name.split('.')[1]

  const hoverClassName = useMemo(() => {
    return disabled ? '' : 'hover:bg-[#333]'
  }, [disabled])

  const cursorClassName = useMemo(() => {
    return disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  }, [disabled])

  const textClassName = useMemo(() => {
    return disabled ? 'text-[#7c7c7c]' : 'text-inherit'
  }, [disabled])

  return (
    <div
      className={`flex items-center py-2 pl-2 ${cursorClassName} ${hoverClassName}`}
    >
      {FILE_ICONS[ext] || FILE_ICONS.default}

      <span className={`pl-2 select-none ${textClassName}`}>{name}</span>
      <Help>{help}</Help>
    </div>
  )
}

const Folder = ({ name, expand, help, disabled, children }) => {
  const [isOpen, setIsOpen] = useState(expand || false)

  const hoverClassName = useMemo(() => {
    return disabled ? '' : 'hover:bg-[#333]'
  }, [disabled])

  const cursorClassName = useMemo(() => {
    return disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  }, [disabled])

  const textClassName = useMemo(() => {
    return disabled ? 'text-[#7c7c7c]' : 'text-inherit'
  }, [disabled])

  const toggeClassName = useMemo(() => {
    return isOpen ? 'h-auto' : 'h-0'
  }, [isOpen])

  return (
    <>
      <div
        className={`flex items-center py-2 pl-2 ${cursorClassName} ${hoverClassName}`}
        onClick={() => (disabled ? '' : setIsOpen(!isOpen))}
      >
        {isOpen ? <VscFolderOpened /> : <VscFolder />}
        <span className={`pl-2 select-none ${textClassName}`}>{name}</span>
        <Help>{help}</Help>
      </div>
      <div className={`pl-4 overflow-hidden ${toggeClassName}`}>
        {children}
      </div>
    </>
  )
}

const TreeRecursive = ({ data }) => {
  return data.map((item) => {
    const { childrens, ...props } = item

    switch (props.type) {
      case 'file':
        return <File key={generateUnid()} {...props} />

      case 'folder':
        return (
          <Folder key={generateUnid()} {...props}>
            {item?.childrens?.length ? (
              <TreeRecursive data={item.childrens} />
            ) : null}
          </Folder>
        )

      default:
        return null
    }
  })
}

const Tree = ({ data, children }) => {
  const isImparative = data && !children

  return (
    <div className="rounded bg-[#1d1f21] p-4 text-sm text-[#bfc8c6]">
      {isImparative ? <TreeRecursive data={data} /> : children}
    </div>
  )
}

Tree.File = File
Tree.Folder = Folder

Tree.File.displayName = 'File'
Tree.Folder.displayName = 'Folder'
Tree.displayName = 'Tree'

export default Tree
