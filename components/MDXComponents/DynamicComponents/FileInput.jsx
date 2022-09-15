import React, { useState } from 'react'
import Image from 'next/image'

const FileInput = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const onChange = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()

    if (file) {
      reader.readAsDataURL(file)
    }

    reader.addEventListener(
      'load',
      () => {
        setSelectedFile(reader.result)
      },
      false
    )
  }

  return (
    <form className="flex items-center space-x-6 py-6">
      <div className="shrink-0">
        {selectedFile && (
          <Image
            className="h-16 w-16 object-cover"
            src={selectedFile}
            alt="upload-image"
            width={100}
            height={100}
          />
        )}
      </div>
      <label className="block">
        <input
          type="file"
          onChange={onChange}
          className="block w-full text-sm text-gray-900 file:mr-4
              file:rounded-full file:border-0 file:bg-cyan-500
              file:py-2 file:px-4
              file:text-sm file:font-semibold
              file:text-white dark:text-gray-300
              dark:file:bg-gray-700 dark:file:text-gray-400
            "
        />
      </label>
    </form>
  )
}

export default FileInput
