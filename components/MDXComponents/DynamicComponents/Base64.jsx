import React, { useState } from 'react'

const Base64 = () => {
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
    <div>
      <input type="file" onChange={onChange} />
      <br />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={selectedFile} height="200" alt="Image preview..."></img>
    </div>
  )
}

export default Base64
