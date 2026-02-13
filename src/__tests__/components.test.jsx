import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar, TrendingUp } from "lucide-react";
import { vi } from "vitest";
import PrimaryButton from "../components/ui/PrimaryButton.jsx";
import IconButton from "../components/ui/IconButton.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import SectionCard from "../components/ui/SectionCard.jsx";

it("renders PrimaryButton and handles click", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<PrimaryButton onClick={handleClick}>Save</PrimaryButton>);
  await user.click(screen.getByRole("button", { name: /save/i }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it("renders IconButton with aria-label", () => {
  render(
    <IconButton label="Remove item">
      <span>×</span>
    </IconButton>,
  );
  expect(screen.getByLabelText("Remove item")).toBeInTheDocument();
});

it("renders StatCard content", () => {
  render(
    <StatCard
      icon={Calendar}
      accentIcon={TrendingUp}
      value="₱5,000.00"
      label="Today"
      className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
      labelClassName="text-blue-100"
    />,
  );
  expect(screen.getByText("₱5,000.00")).toBeInTheDocument();
  expect(screen.getByText("Today")).toBeInTheDocument();
});

it("renders SectionCard title and content", () => {
  render(
    <SectionCard title="Section">
      <div>Content</div>
    </SectionCard>,
  );
  expect(screen.getByText("Section")).toBeInTheDocument();
  expect(screen.getByText("Content")).toBeInTheDocument();
});
