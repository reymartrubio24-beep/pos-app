import { DollarSign } from "lucide-react";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";

export default {
  title: "UI/PrimaryButton",
  component: PrimaryButton,
};

export const Default = {
  args: {
    children: (
      <>
        <DollarSign size={18} />
        Primary Action
      </>
    ),
    className: "px-6 py-3 flex items-center gap-2",
  },
  render: (args) => <PrimaryButton {...args} />,
};
