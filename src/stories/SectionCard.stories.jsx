import SectionCard from "../components/ui/SectionCard.jsx";

export default {
  title: "UI/SectionCard",
  component: SectionCard,
};

export const Default = {
  args: {
    title: "Section Title",
  },
  render: (args) => (
    <SectionCard {...args}>
      <div className="px-6 py-4 text-gray-600">Section content goes here.</div>
    </SectionCard>
  ),
};
