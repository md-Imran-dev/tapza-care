import { test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { useAuth } from "../src/state/auth";
beforeEach(() => {
  jest.useFakeTimers();
  useAuth.setState({
    session: null,
    phone: "",
    otpSentAt: 0,
    busy: false,
    error: null,
  });
});
afterEach(() => {
  jest.useRealTimers();
});
test("invalid mobile number cannot request OTP", async () => {
  expect(await useAuth.getState().sendOtp("123")).toBe(false);
  expect(useAuth.getState().phone).toBe("");
});
test("incorrect OTP cannot create a session; verified OTP can", async () => {
  const send = useAuth.getState().sendOtp("9876543210");
  await jest.advanceTimersByTimeAsync(500);
  await send;
  const bad = useAuth.getState().verify("000000");
  await jest.advanceTimersByTimeAsync(500);
  expect(await bad).toBe(false);
  expect(useAuth.getState().session).toBeNull();
  const good = useAuth.getState().verify("123456");
  await jest.advanceTimersByTimeAsync(500);
  expect(await good).toBe(true);
  expect(useAuth.getState().session?.phone).toBe("9876543210");
});
