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
