const Tag = ({ children }) => {
  return (
    <button className="rounded-full text-xs bg-cyan-500 px-2 font-semibold text-white shadow-sm">
      {children}
    </button>
  )
}

export default Tag
