import { expect, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import { DoctorCard } from "../components/doctors/DoctorCard";
import { DOCTORS } from "../data/mockData";

test("doctor card keeps details, booking and clinic contact actions separate", async () => {
  const doctor = DOCTORS[0];
  await render(<DoctorCard doctor={doctor} />);
  await fireEvent.press(screen.getByRole("button", { name: `View details for ${doctor.name}` }));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: "/doctor/[id]", params: { id: doctor.id } });
  await fireEvent.press(screen.getByRole("button", { name: `Book now with ${doctor.name}` }));
  expect(router.push).toHaveBeenLastCalledWith({ pathname: "/booking", params: { doctorId: doctor.id } });
  await fireEvent.press(screen.getByRole("button", { name: "Contact clinic" }));
  expect(router.push).toHaveBeenLastCalledWith("/contact");
});
