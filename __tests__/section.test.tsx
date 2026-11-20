import { expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { SectionRenderer } from "../components/home/SectionRenderer";
import { CONFIG_NORMAL } from "../data/mockData";
const scroll = { value: 0 } as Parameters<typeof SectionRenderer>[0]["scroll"];
test("unknown section renders nothing", async () => {
  const result = await render(
    <SectionRenderer
      scroll={scroll}
      section={{
        id: "future",
        type: "future_widget",
        title: "Never show",
        background: { kind: "color", value: "#ffffff" },
        items: [],
      }}
    />,
  );
  expect(result.toJSON()).toBeNull();
});
test("quick action uses config copy and navigates to the correct flow", async () => {
  const section = CONFIG_NORMAL.sections.find(
    (s) => s.type === "quick_actions",
  )!;
  await render(<SectionRenderer scroll={scroll} section={section} />);
  expect(screen.getByText("Quick actions")).toBeTruthy();
  await fireEvent.press(screen.getByText("Prescriptions"));
  expect(router.push).toHaveBeenCalledWith("/prescriptions");
});

test("home Book visit opens the booking sheet to choose a doctor", async () => {
  const section = CONFIG_NORMAL.sections.find((s) => s.type === "hero_banner")!;
  await render(<SectionRenderer scroll={scroll} section={section} />);
  await fireEvent.press(screen.getByText("Book visit"));
  expect(router.push).toHaveBeenLastCalledWith("/booking");
});

test("home sample collection opens its own service flow without a doctor", async () => {
  const serviceSection = CONFIG_NORMAL.sections.find((s) => s.type === "service_grid")!;
  const collection = serviceSection.items.find((item) => (item as { id: string }).id === "s4");
  await render(<SectionRenderer scroll={scroll} section={{ ...serviceSection, items: [collection] }} />);
  await fireEvent.press(screen.getByText("ADD +"));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: "/service/[id]", params: { id: "s4" } });
});
