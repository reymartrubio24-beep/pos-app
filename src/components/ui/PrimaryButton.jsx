const PrimaryButton = ({
  children,
  className = "",
  onClick,
  type = "button",
  ...rest
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default PrimaryButton;
