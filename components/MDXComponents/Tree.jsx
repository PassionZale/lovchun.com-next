import React, { useMemo, useState } from 'react'
import { AiOutlineFolder, AiOutlineFile } from 'react-icons/ai'
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact } from 'react-icons/di'
import { generateUnid } from '@/lib/dataTransform'

const FILE_ICONS = {
  
}

const File = ({ name, fileType }) => {
  const ext = fileType ? fileType : name.split('.')[1]

  return (
    <div className="flex items-center pl-5 cursor-pointer">
      {FILE_ICONS[ext] || AiOutlineFile}

      <span className="ml-1.5 select-none">{name}</span>
    </div>
  )
}

const Folder = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (e) => {
    setIsOpen(!isOpen)
  }

  const toggeClassName = useMemo(() => {
    return isOpen ? 'h-auto' : 'h-0'
  }, [isOpen])

  return (
    <div className="pl-5">
      <div className="flex cursor-pointer items-center" onClick={handleToggle}>
        <AiOutlineFolder />
        <span className="ml-1.5 select-none">{name}{isOpen}</span>
      </div>
      <div className={`ml-1.5 overflow-hidden ${toggeClassName}`}>
        {children}
      </div>
    </div>
  )
}

const TreeRecursive = ({ data }) => {
  // loop through the data
  return data.map(item => {
    // if its a file render <File />
    if (item.type === "file") {
      return <File key={generateUnid()} name={item.name} fileType={item.fileType} />;
    }
    // if its a folder render <Folder />
    if (item.type === "folder") {
      return (
        <Folder key={generateUnid()} name={item.name}>
          {/* Call the <TreeRecursive /> component with the current item.childrens */}
          <TreeRecursive data={item.childrens || []} />
        </Folder>
      );
    }
  });
};

const Tree = ({ data, children }) => {
  const isImparative = data && !children

  return <div>{isImparative ? <TreeRecursive data={data} /> : children}</div>
}

Tree.File = File
Tree.Folder = Folder

export default Tree
