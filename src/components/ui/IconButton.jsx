const IconButton = ({
  children,
  className = "",
  label,
  onClick,
  type = "button",
  ...rest
}) => (
  <button
    type={type}
    aria-label={label}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1A1A1D] ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default IconButton;
