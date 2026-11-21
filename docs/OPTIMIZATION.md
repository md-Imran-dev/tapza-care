# Architecture and optimization notes

Updated 21 November 2026.

## What changed

The structure follows the Zotto reference: `services/` owns endpoint calls, `store/` owns shared state and request handling, `hooks/` connects React components to that state, and `utilities/` contains shared helpers. Screens no longer fetch slots directly. This makes loading, retry and error behaviour consistent across doctor details and booking.

MMKV backs Zustand `persist`. Only useful saved data is persisted: onboarding, patient bookings/doses/language/config, and API responses. Loading flags, errors and in-flight requests are excluded. Patient snapshots use separate phone-scoped keys; resetting the active store does not overwrite the previous patient's snapshot. Session credentials remain in SecureStore on native devices.

AsyncStorage and its migration were removed at the user's request. Old AsyncStorage-only data is not automatically imported. Save failures keep in-memory changes usable and expose a store error.

## How rendering and requests are kept small

- Home uses FlatList with three initial sections, batches of three and a window size of five. Doctor lists also use small batches; the picker starts with four cards.
- Doctor cards, the picker and Home sections are memoized. Search results and viewability configuration are memoized too. Store selectors let components subscribe to the state they need.
- Variable-height sections use natural measurement. Fixed row heights were avoided because translated copy and system font scaling change layout.
- Reanimated handles scroll transforms and gestures. Shared photos disable Android image crossfade; only the appropriate visible photo participates in a transition. Reduce Motion disables shared transitions.
- Slot request counters and reset guards prevent late responses from replacing current UI state. Cached responses are used on network failure, while other errors remain visible for retry.
- Optimistic booking avoids waiting for the response before showing progress. Stable request IDs make offline retries idempotent; conflicts are reconciled instead of silently duplicating a booking.

## Evidence and limits

Lint, strict TypeScript and 46 tests across 16 suites pass. Android, iOS and web bundle exports pass. The MMKV-only ARM64 Android debug build succeeded and its APK signature was verified. It needs Metro and was not installed after this refactor because no phone was connected.

These changes are not a measured speedup claim. The earlier release sample recorded 0.91% janky frames during general interactions and 5.32% during focused photo navigation; the legacy counters were higher. Those measurements predate this storage refactor and the transform-tracking fix. See [PERFORMANCE_CHECK.md](PERFORMANCE_CHECK.md). A fresh device benchmark and standalone submission APK are still needed.
