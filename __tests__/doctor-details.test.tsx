import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DoctorDetails } from "../components/doctors/DoctorDetails";
import { DOCTORS } from "../data/mockData";
import { useResource } from "../hooks/useResource";
import { localDateKey } from "../lib/dates";

jest.mock("../hooks/useResource");

test("doctor details requires an available time and passes the selection to booking", async () => {
  const date = localDateKey();
  jest.mocked(useResource).mockReturnValue({
    data: [{ id: "available", startsAt: `${date}T18:30:00+05:30`, label: "06:30 PM", available: true }, { id: "taken", startsAt: `${date}T19:30:00+05:30`, label: "07:30 PM", available: false }],
    loading: false, error: null, retry: jest.fn(),
  });
  const onBook = jest.fn();
  await render(<DoctorDetails doctor={DOCTORS[0]} onBook={onBook} />);
  await fireEvent.press(screen.getByText("Book session"));
  expect(onBook).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText("07:30 PM"));
  await fireEvent.press(screen.getByText("Book session"));
  expect(onBook).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByText("06:30 PM"));
  await fireEvent.press(screen.getByText("Book session"));
  expect(onBook).toHaveBeenCalledWith(date, "available");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  await fireEvent.press(screen.getByRole("button", { name: tomorrow.toDateString() }));
  await fireEvent.press(screen.getByText("Book session"));
  expect(onBook).toHaveBeenCalledTimes(1);
});
