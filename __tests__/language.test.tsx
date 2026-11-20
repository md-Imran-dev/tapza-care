import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Header } from "../components/Header";
import { LanguageLoader } from "../components/LanguageLoader";
import { Txt } from "../components/ui";
import { localeFor, translateText } from "../lib/i18n";
import { storage } from "../lib/storage";
import { useCare } from "../state/app";

jest.mock("react-native-safe-area-context", () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
beforeEach(() => { useCare.getState().reset(); useCare.setState({ scope: "language-test", hydrated: true }); });
afterEach(() => { jest.restoreAllMocks(); useCare.getState().reset(); });

test("language tap shows processing then updates patient UI and persists the preference", async () => {
  await render(<><Header /><Txt>Clinic services</Txt><LanguageLoader /></>);
  await fireEvent.press(screen.getByRole("button", { name: "हिन्दी" }));
  expect(useCare.getState().languageChanging).toBe(true);
  expect(screen.getByText("Changing language…")).toBeTruthy();
  expect(await screen.findByText("क्लिनिक सेवाएं")).toBeTruthy();
  expect(useCare.getState().languageChanging).toBe(false);
  expect(await storage.read("language:language-test")).toBe("hi");
  await fireEvent.press(screen.getByRole("button", { name: "తెలుగు" }));
  expect(await screen.findByText("క్లినిక్ సేవలు")).toBeTruthy();
  await fireEvent.press(screen.getByRole("button", { name: "English" }));
  expect(await screen.findByText("Clinic services")).toBeTruthy();
});

test("failed preference save keeps the previous language and enables retry", async () => {
  jest.spyOn(storage, "write").mockRejectedValueOnce(new Error("Storage full"));
  await useCare.getState().setLang("te");
  expect(useCare.getState()).toMatchObject({ lang: "en", languageChanging: false, languageError: "Could not change language. Please retry." });
  await useCare.getState().setLang("te");
  expect(useCare.getState().lang).toBe("te");
});

test("reset during a language change does not apply the previous patient's result", async () => {
  const pending = useCare.getState().setLang("hi");
  useCare.getState().reset();
  await pending;
  expect(useCare.getState()).toMatchObject({ lang: "en", languageChanging: false });
});

test("translation preserves patient data and handles booking copy and locale", () => {
  expect(translateText("Dr. Ananya Reddy", "hi")).toBe("Dr. Ananya Reddy");
  expect(translateText("constructor", "hi")).toBe("constructor");
  expect(translateText("Paracetamol 650", "te")).toBe("Paracetamol 650");
  expect(translateText("Confirm booking · 09:00 AM", "hi")).toBe("बुकिंग पक्की करें · 09:00 पूर्वाह्न");
  expect(localeFor("te")).toBe("te-IN");
});

test("saved language restores after patient hydration", async () => {
  await storage.write("language:language-restore-test", "te");
  useCare.getState().updateNetwork({ latencyMs: 0 });
  await useCare.getState().hydrate("language-restore-test");
  expect(useCare.getState().lang).toBe("te");
});
