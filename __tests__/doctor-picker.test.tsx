import { expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DoctorPicker } from "../components/doctors/DoctorPicker";
import { DOCTORS } from "../data/mockData";

test("doctor picker allows another doctor and blocks changes while booking", async () => {
  const onSelect = jest.fn();
  const result = await render(<DoctorPicker doctors={DOCTORS} selectedId={DOCTORS[0].id} onSelect={onSelect} />);
  await fireEvent.press(screen.getByRole("button", { name: `Select ${DOCTORS[1].name}` }));
  expect(onSelect).toHaveBeenCalledWith(DOCTORS[1].id);
  onSelect.mockClear();
  await result.rerender(<DoctorPicker doctors={DOCTORS} selectedId={DOCTORS[0].id} disabled onSelect={onSelect} />);
  await fireEvent.press(screen.getByRole("button", { name: `Select ${DOCTORS[1].name}` }));
  expect(onSelect).not.toHaveBeenCalled();
});
