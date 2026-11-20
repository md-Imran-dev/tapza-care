# Tapza Care

A patient app built for the Tapza Care React Native assignment. The main flows are a config-driven Home, booking a visit, and managing prescriptions. Built with Expo SDK 58, TypeScript and Expo Router.

## Run locally

Use Node 22+, Yarn Classic, and the Android SDK or Xcode for native builds.

```sh
yarn install --frozen-lockfile
yarn android                 # build and launch on Android
# or: yarn ios
```

After installing the development build, use `yarn start` for day-to-day changes. Keep Metro running. Use a development build for native photo transitions; Expo Go cannot enable this project's experimental native flag. `yarn web` provides a browser preview, with native features limited.

Sign in with a valid-format Indian mobile number and demo OTP **123456**. New users enter their name. Authentication is mocked: no SMS is sent. There is no guest flow.

## What to try

- Home renders ordered sections, backgrounds and tabs from config. Switch normal/festival mode in Profile to change colours, content and section order without restarting.
- Book visit opens the scheduling sheet with a doctor selected. Swipe through doctors, choose a date and available time, then confirm. Previously consulted doctors have a separate filter.
- Service cards use their own booking flow. Home collection asks for an address and PIN; clinic services show the clinic location.
- Prescriptions show morning, afternoon and night doses. Marking a dose persists for that patient and date.
- Profile's demo lab simulates delay, offline mode, failed config/slot requests, empty lists and booking conflicts. Load slots before enabling offline to try queued booking.
- English, Hindi and Telugu can be changed from the header. Medicine reminders require native notification permission.

All requests use an in-process mock backend. There are no real reservations, payments, SMS or service dispatches.

## Structure and decisions

```text
app/             Expo Router screens, layouts and route guards
components/      reusable UI, Home sections, doctor cards and booking controls
state/           Zustand auth and patient state
lib/             mock API, validation, persistence, translations and reminders
hooks/           shared hooks
data/           types and normal/festival fixtures
theme/          config-derived colours, spacing and typography
__tests__/       focused rendering, validation and state tests
docs/            demo, screenshots and validation notes
```

Screens stay in route files; reusable code stays outside `app/`. This keeps navigation easy to follow without a second `screens/` hierarchy.

Expo Router handles protected routes and deep links. Zustand holds shared state. An Axios mock adapter provides API-shaped requests, delays and failures without requiring a server. Zod validates config before rendering; the last good config stays available if refresh fails. Unknown section types are skipped.

Native sessions use SecureStore. AsyncStorage stores non-secret demo state and cached config; it was sufficient here and avoids another native storage dependency. Browser sessions use sessionStorage.

Bookings appear optimistically, then reconcile with the mock response. Conflicts roll back the rejected item. Offline retries use stable request IDs to avoid duplicates. Patient state is scoped by phone number, and stale responses are guarded during logout or config changes.

Lists use FlatList and memoized cards/sections. Variable-height content keeps natural measurement so larger system fonts do not break fixed row estimates. Reanimated handles gestures and photo transitions; shared UI reads theme tokens.

## Checks and known limits

```sh
yarn lint
yarn typecheck
yarn test
```

Latest checks: lint, strict TypeScript and **40 tests across 14 suites** pass. Tests cover config validation, section rendering, auth, booking/conflicts/offline replay, service booking, language persistence and key UI interactions. Native animations are mocked in unit tests.

Android testing used a V2503 running Android 17. Both themes and 130% font scaling were checked. Photo navigation works, but the focused release sample still recorded 5.32% janky frames. This is not a claim of perfectly smooth animation. See [performance notes](docs/PERFORMANCE_CHECK.md) for measurements and limits. iOS, full screen-reader testing, timed notification delivery and a long-running performance test remain unverified.

## Android build and demo

For a local standalone ARM64 APK using the existing generated Android project:

```sh
cd android
./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a
```

Output: `android/app/build/outputs/apk/release/app-release.apk`. The latest local test build uses the debug signing key and runs without Metro; it is not a Play Store release.

The [earlier preview APK](https://expo.dev/artifacts/eas/omr6a0KPf_ioe4jBVqu6sta258r0WGON8xMxZyewVBE.apk) predates the latest changes. Download it on Android, allow installation from the download source, then open the app. A fresh shared build is still needed for the final handoff. For a cloud preview: `npx eas-cli@latest build --platform android --profile preview`.

The [demo video](docs/tapza-care-android-demo.mp4) and [screenshots](docs/screenshots/) also show an earlier iteration. They are useful flow evidence, not an exact recording of the latest UI.

## What I left out, and why

- Dark mode and automated E2E tests: prioritised the required flows and focused tests.
- A production backend, real OTP, payments and dispatch: kept the assessment self-contained with explicit mock behaviour.
- Family management: the family view uses sample data; full CRUD was outside the main patient flow.
- Full translation of clinical data or arbitrary admin-written copy: built-in UI is translated; names, medicines and custom content remain as authored.
- Guaranteed offline images: remote photos need a connection on first load. Mock server reservations also reset with the process, while local patient history persists.

Shared photo transitions remain experimental. They were kept as an optional enhancement, with reduced-motion support and the remaining stutter documented.

## Time and AI use

Work took place across 19–20 November 2026, including follow-up UI changes and device checks. I did not track active hours, so I cannot honestly give an exact total. Calendar time should not be read as uninterrupted development time.

Codex helped write and revise code, tests and documentation. [AI_LOG.md](AI_LOG.md) records the prompts that shaped the app and approaches that were rejected. No submission email has been sent.
