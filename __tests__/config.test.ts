import { test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { parseConfig } from "../src/lib/config";
import { CONFIG_NORMAL, CONFIG_DIWALI } from "../src/data/mockData";
test.each([CONFIG_NORMAL, CONFIG_DIWALI])(
  "accepts complete normal/festival config v$version",
  (config) => expect(parseConfig(config).version).toBe(config.version),
);
test("rejects missing theme and malformed known items", () => {
  expect(() => parseConfig({ ...CONFIG_NORMAL, theme: null })).toThrow();
  expect(() =>
    parseConfig({
      ...CONFIG_NORMAL,
      sections: [
        { ...CONFIG_NORMAL.sections[0], items: [{ greeting: "Incomplete" }] },
      ],
    }),
  ).toThrow();
});
test("accepts a future section without interpreting its items", () => {
  expect(
    parseConfig({
      ...CONFIG_NORMAL,
      sections: [
        {
          id: "future",
          type: "future_widget",
          background: { kind: "color", value: "#ffffff" },
          items: [{ arbitrary: true }],
        },
      ],
    }).sections[0].type,
  ).toBe("future_widget");
});
test("rejects duplicate section IDs and duplicate tab routes", () => {
  expect(() =>
    parseConfig({
      ...CONFIG_NORMAL,
      sections: [CONFIG_NORMAL.sections[0], CONFIG_NORMAL.sections[0]],
    }),
  ).toThrow();
  expect(() =>
    parseConfig({
      ...CONFIG_NORMAL,
      tabs: [CONFIG_NORMAL.tabs[0], CONFIG_NORMAL.tabs[0]],
    }),
  ).toThrow();
});
