import Image from 'next/image'

const RoundedImage = (props) => {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

export default RoundedImage
