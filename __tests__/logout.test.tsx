import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen, within } from "@testing-library/react-native";
import Profile from "../app/(secure)/(tabs)/profile";
import { useAuth } from "../state/auth";

jest.mock("../components/Page", () => ({
  Page: ({ children }: { children: React.ReactNode }) => children,
}));

test("sign out requires confirmation and Cancel keeps the session", async () => {
  const logout = jest.spyOn(useAuth.getState(), "logout").mockResolvedValue();
  await render(<Profile />);
  await fireEvent.press(screen.getByText("Sign out"));
  expect(screen.getByText("Sign out?")).toBeTruthy();
  expect(logout).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText("Cancel"));
  expect(screen.queryByText("Sign out?")).toBeNull();
  expect(logout).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText("Sign out"));
  await fireEvent.press(within(screen.getByTestId("confirm-dialog")).getByRole("button", { name: "Sign out" }));
  expect(logout).toHaveBeenCalledTimes(1);
  logout.mockRestore();
});
