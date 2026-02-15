const SectionCard = ({
  children,
  title,
  className = "",
  headerClassName = "",
  titleClassName = "",
}) => (
  <div
    className={`bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden ${className}`}
  >
    <div
      className={`bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600 ${headerClassName}`}
    >
      <h3 className={`text-xl font-bold text-gray-800 dark:text-gray-100 ${titleClassName}`}>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default SectionCard;
