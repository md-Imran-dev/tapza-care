import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DoctorChooser } from "../components/doctors/DoctorChooser";
import { DOCTORS, PRESCRIPTIONS } from "../data/mockData";

test("doctor categories show only their list without changing the selected doctor", async () => {
  const onSelect = jest.fn();
  const rx = PRESCRIPTIONS[0];
  const consulted = DOCTORS.find((d) => d.name === rx.doctorName)!;
  const other = DOCTORS.find((d) => d.name !== rx.doctorName)!;
  await render(<DoctorChooser doctors={DOCTORS} prescriptions={[rx, rx]} selectedId={null} onSelect={onSelect} />);
  expect(screen.queryByText(consulted.name)).toBeNull();
  await fireEvent.press(screen.getByText("Choose a doctor"));
  expect(screen.getByText(other.name)).toBeTruthy();
  await fireEvent.press(screen.getByText("Previously consulted"));
  expect(screen.queryByText(other.name)).toBeNull();
  expect(screen.getAllByText(consulted.name)).toHaveLength(1);
  expect(onSelect).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole("button", { name: `Select ${consulted.name}` }));
  expect(onSelect).toHaveBeenCalledWith(consulted.id);

});

test("consulted category stays empty without prescription history", async () => {
  await render(<DoctorChooser doctors={DOCTORS} prescriptions={[]} selectedId={null} onSelect={jest.fn()} />);
  await fireEvent.press(screen.getByText("Previously consulted"));
  expect(screen.getByText("No previously consulted doctors found in your prescription history.")).toBeTruthy();
  expect(screen.queryByText(DOCTORS[0].name)).toBeNull();
});

test("switching categories preserves the existing doctor selection", async () => {
  const doctor = DOCTORS.find((d) => d.name === PRESCRIPTIONS[0].doctorName)!;
  const onSelect = jest.fn();
  await render(<DoctorChooser doctors={DOCTORS} prescriptions={[PRESCRIPTIONS[0]]} selectedId={doctor.id} onSelect={onSelect} />);
  await fireEvent.press(screen.getByText("Previously consulted"));
  expect(screen.getByRole("button", { name: `Select ${doctor.name}`, selected: true })).toBeTruthy();
  await fireEvent.press(screen.getByText("Choose a doctor"));
  expect(screen.getByRole("button", { name: `Select ${doctor.name}`, selected: true })).toBeTruthy();
  expect(onSelect).not.toHaveBeenCalled();
});
