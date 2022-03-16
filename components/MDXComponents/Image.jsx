import NextImage from 'next/image'

export const Image = (props) => {
  return <NextImage alt={props.alt || 'image'} className="rounded-lg" {...props} />
}

export default Image
