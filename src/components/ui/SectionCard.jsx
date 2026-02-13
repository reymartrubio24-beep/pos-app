const SectionCard = ({
  children,
  title,
  className = "",
  headerClassName = "",
  titleClassName = "",
}) => (
  <div
    className={`bg-white rounded-lg border-2 border-gray-200 overflow-hidden ${className}`}
  >
    <div
      className={`bg-gray-50 px-6 py-4 border-b-2 border-gray-200 ${headerClassName}`}
    >
      <h3 className={`text-xl font-bold text-gray-800 ${titleClassName}`}>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default SectionCard;
