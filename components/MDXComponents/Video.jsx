import React, { useState, useEffect } from 'react'

const types = [
  {
    mov: 'video/quicktime',
  },
]

// video props see => https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video
const Video = ({ src, ...props }) => {
  const [sourceType, setSourceType] = useState('')

  useEffect(() => {
    const arrs = src.split('.')

    const suffix = arrs[arrs.length - 1]

    const found = types.find((item) => item[suffix])

    setSourceType[found ? found[suffix] : `video/${suffix}`]
  }, [src])

  return (
    <div className="relative overflow-auto rounded-xl">
      <video
        className="aspect-video w-full rounded-lg shadow-lg mt-0"
        controls
        {...props}
      >
        <source type={sourceType} src={src} />
        你的浏览器不支持播放 HTML5 视频。 你可以
        <a href={src} download>
          下载视屏
        </a>
        观看。
      </video>
    </div>
  )
}
export default Video
