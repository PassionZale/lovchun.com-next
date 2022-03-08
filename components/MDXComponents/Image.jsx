import NextImage from 'next/image'

const Image = (props) => {
  return <NextImage alt={props.alt} className="rounded-lg" {...props} />
}

export default Image
