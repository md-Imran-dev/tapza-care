jest.mock("react-native-worklets", () =>
  require("react-native-worklets/src/mock"),
);
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("expo-symbols", () => ({ SymbolView: () => null }));
jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock("expo-router", () => ({
  useIsFocused: () => true,
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));
jest.mock("react-native-reanimated", () => {
  const { Animated, Easing } = require("react-native");
  return {
    __esModule: true,
    default: Animated,
    Easing,
    FadeIn: { duration: () => undefined },
    ZoomIn: { duration: () => undefined },
    SharedTransition: { duration: () => ({ easing: () => ({}) }) },
    SharedTransitionBoundary: ({ children }) => children,
    useReducedMotion: () => false,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (factory) => factory(),
    useAnimatedScrollHandler: () => () => {},
    withTiming: (value) => value,
    interpolate: (value) => value,
  };
});
