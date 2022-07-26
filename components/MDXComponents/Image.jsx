import NextImage from 'next/image'

export const Image = (props) => {
  return (
    <div className="flex justify-center rounded-lg overflow-hidden">
      <NextImage alt={props.alt || 'image'} {...props} />
    </div>
  )
}

export default Image
