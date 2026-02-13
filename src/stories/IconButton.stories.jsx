import { Trash2 } from "lucide-react";
import IconButton from "../components/ui/IconButton.jsx";

export default {
  title: "UI/IconButton",
  component: IconButton,
};

export const Default = {
  args: {
    label: "Remove item",
    className: "w-10 h-10 bg-gray-100 text-red-500 hover:text-red-700",
  },
  render: (args) => (
    <IconButton {...args}>
      <Trash2 size={18} />
    </IconButton>
  ),
};
