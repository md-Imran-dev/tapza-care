import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { BookingSheet } from "../components/booking/BookingSheet";
import { Txt } from "../components/ui";
jest.mock("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
jest.mock("react-native-gesture-handler", () => ({
  GestureDetector: ({ children }: { children: React.ReactNode }) => children,
  Gesture: { Pan: () => { const builder = { enabled: () => builder, onUpdate: () => builder, onEnd: () => builder }; return builder; } },
}));
test("service sheet exposes content and prevents dismissal during confirmation", async () => {
  const close = jest.fn();
  const result = await render(<BookingSheet title="Clinic services" disabled onClose={close}><Txt>Pick a date</Txt></BookingSheet>);
  expect(screen.getByText("Pick a date")).toBeTruthy();
  await fireEvent.press(screen.getAllByRole("button", { name: "Close booking" })[1]);
  expect(close).not.toHaveBeenCalled();
  await result.rerender(<BookingSheet title="Clinic services" onClose={close}><Txt>Pick a date</Txt></BookingSheet>);
  await fireEvent.press(screen.getAllByRole("button", { name: "Close booking" })[1]);
  expect(close).toHaveBeenCalledTimes(1);
});
