import NextImage from 'next/image'

export const Image = (props) => {
  return <NextImage alt={props.alt} className="rounded-lg" {...props} />
}

export default Image
