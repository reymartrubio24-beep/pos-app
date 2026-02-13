import { Calendar, TrendingUp } from "lucide-react";
import StatCard from "../components/ui/StatCard.jsx";

export default {
  title: "UI/StatCard",
  component: StatCard,
};

export const Default = {
  args: {
    icon: Calendar,
    accentIcon: TrendingUp,
    value: "₱12,345.00",
    label: "Today's Sales",
    className: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    labelClassName: "text-blue-100",
  },
  render: (args) => <StatCard {...args} />,
};
