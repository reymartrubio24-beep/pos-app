const StatCard = ({
  icon: Icon,
  accentIcon: AccentIcon,
  value,
  label,
  className = "",
  labelClassName = "",
  valueClassName = "",
}) => (
  <div className={`p-6 rounded-lg shadow-lg ${className}`}>
    <div className="flex items-center justify-between mb-2">
      {Icon && <Icon size={32} />}
      {AccentIcon && <AccentIcon size={24} />}
    </div>
    <div className={`text-3xl font-bold mb-1 ${valueClassName}`}>{value}</div>
    <div className={labelClassName}>{label}</div>
  </div>
);

export default StatCard;
