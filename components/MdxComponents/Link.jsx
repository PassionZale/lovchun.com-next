import Link from "next/link";

const CustomLink = ({ as, href, ...others }) => {
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Link as={as} href={href}>
        <a {...others} />
      </Link>
    );
  }

  return <a target="_blank" href={href} rel="noopener noreferrer" {...others} />;
};

export default CustomLink;