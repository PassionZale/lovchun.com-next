const Tag = ({ children, onClick }) => {
  const handleClick = () => {
    onClick && onClick()
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-cyan-500 px-2 text-xs font-semibold text-white shadow-sm"
    >
      {children}
    </button>
  )
}

export default Tag
