import { useIsFocused } from "expo-router";
import type { ReactNode } from "react";
import {
  SharedTransitionBoundary,
  useReducedMotion,
} from "react-native-reanimated";

// Keep boundaries on leaf screens, not the stacks/tabs that contain them.
export function TransitionScreen({ children }: { children: ReactNode }) {
  const focused = useIsFocused();
  const reducedMotion = useReducedMotion();
  return (
    <SharedTransitionBoundary isActive={focused && !reducedMotion}>
      {children}
    </SharedTransitionBoundary>
  );
}
