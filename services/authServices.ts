// Assessment-only authentication; no SMS provider is contacted.
export async function requestOtp(phone: string): Promise<number> {
  if (!/^[6-9]\d{9}$/.test(phone))
    throw new Error("Enter a valid 10-digit Indian mobile number.");
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Date.now();
}

export async function verifyOtp(
  phone: string,
  otp: string,
  sentAt: number,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!phone || Date.now() - sentAt > 300000 || otp !== "123456")
    throw new Error(
      "Incorrect or expired code. Use demo code 123456 or resend.",
    );
  return `mock-${Date.now()}`;
}
