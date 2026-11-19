# Tapza Care

A React Native / Expo SDK 58 patient app for the Tapza Care mobile assignment. The design follows the supplied prototype; the app architecture follows Zotto's onboarding → phone/OTP → profile setup → protected app flow, with **no guest access**.

## Run

Node 22+ and Yarn Classic are recommended.

```sh
yarn install --frozen-lockfile
yarn start
# Press a for Android, i for iOS, or w for the browser preview.
```

Use any valid-format Indian mobile number (10 digits, starting 6–9), then **demo OTP `123456`**. New numbers complete their name before entering the app. OTPs expire after five minutes; resend has a 30-second cooldown. This is a mocked assessment login: no SMS is sent and it must not be used as production authentication.

## Implemented flows

- Config-driven home with hero, category chips, quick actions, services, doctors and offers. Each section owns its background. Viewability triggers one-time reveals, the search header collapses, and the hero has scroll parallax. Unknown types render nothing.
- Profile switches normal/Diwali configuration at runtime. Colours, banner, section order and items change through `GET /config`. Tabs and their order/labels are read from config.
- Doctor search/details and service booking → draggable date/slot sheet → optimistic pending booking → confirmed token and animated success. A 409 removes only the rejected pending booking and lets the user retry.
- Independent loading, empty and error states for appointments and lists. A failed config refresh leaves the last-good layout visible; other tabs remain usable. Pull to refresh retries home/lists.
- Prescriptions list → morning/afternoon/night schedule → mark today's dose taken. Dose keys include prescription, medicine, time period and local calendar date.
- Persistent per-phone booking/dose state and language preference. Offline bookings persist with stable request IDs, replay through the same mock API after reconnect, and reconcile conflicts. Interrupted pending bookings become queued on reopening.
- Local medicine notifications on Android/iOS: schedules the next 60 upcoming doses within prescription durations. Permission is requested only after tapping Enable reminders. Signing out cancels this app's scheduled reminders. Browser preview explains native-only notifications.
- Hindi/Telugu navigation and medicine action labels, family preview, clinic contact preview, and a validated in-app config editor/demo lab.

## Test the difficult states

Profile → **Demo lab & live config editor** exposes delay (200/1000/3000ms), offline, config failure, booking 409, slot-fetch failure, and independent empty slot/doctor/prescription lists. Use Refresh home & lists after changing list/config controls; booking reads slot controls on entry/retry. For the offline queue, load slots first, enable offline in the lab, then create the visit and reconnect using the lab switch.

The network is intentionally simulated. No real booking, payment, SMS or WhatsApp delivery occurs. The contact screen says so explicitly.

## Architecture and folder structure

```text
src/app/
  auth/                 onboarding, login, OTP, profile setup
  (secure)/             patient route guard
    (tabs)/             home, bookings, prescriptions, profile
    booking.tsx         gesture-driven appointment sheet
    doctor/[id].tsx     doctor deep link
    prescription/[id]   prescription deep link
    doctors, family, reminders, contact, admin
src/components/         shared native controls, header and state layouts
src/screens/            composed home/auth/patient views
src/lib/                Axios mock adapter, Zod validation, storage, reminders
src/state/              Zustand auth and patient state
src/theme/              semantic colours, spacing and typography tokens
src/data/               shared types and two sample configurations
__tests__/              focused validation, rendering, auth and state tests
```

Patient routes are gated at their shared layout, including details and modals. Native sessions use Expo SecureStore; the browser demo uses sessionStorage. AsyncStorage holds non-secret demo patient state and last-good config. It was chosen over MMKV to avoid an extra custom native dependency and support Expo Go. This storage choice is allowed by the assessment.

The mocked backend uses an Axios adapter rather than a separate server. Its API contracts are `GET /config`, `GET /doctors`, `GET /slots?doctorId=&date=YYYY-MM-DD`, `POST /bookings {doctorId,slotId}` (201/409) and `GET /prescriptions`. An optional requestId makes offline retries idempotent. Slot IDs encode doctor, date and slot index; timestamps are ISO dates with the Indian timezone offset. Components do not directly mutate server fixtures.

State guards ignore stale responses after logout/config switches. The home uses FlatList, memoized sections and stable viewability callbacks. Fixed `getItemLayout` values are deliberately omitted for variable-height home sections and OS-scaled text; invented heights would cause incorrect scrolling. Reanimated drives scroll transforms and gestures. Colours/spacing/type sizes live in the theme layer, not literal component styles. Touch controls have minimum 44pt targets and native text scaling remains enabled.

## Verification

```sh
yarn lint
yarn typecheck
yarn test
npx expo-doctor
npx expo export --platform android
npx expo export --platform web
```

Four test suites / 15 tests cover both valid configs, malformed config rejection, unknown-section rendering, quick-action navigation, invalid/correct OTP, optimistic confirmation, 409 rollback, duplicate confirmation, persistent offline queue/replay and cached-config fallback. Native animations are mocked in unit tests; this is not device performance evidence.

The development session passed lint, strict TypeScript, these tests, Expo Doctor (20/20), and Android/web bundle exports. Browser testing exercised onboarding, sign-in, name setup and session restoration. The release APK was then installed on a V2503 / Android 17 phone. Onboarding, OTP/profile setup, both themes, dose marking, empty slots, forced 409, drag-to-dismiss, successful booking and history persistence after a full restart passed. Native sign-out and protected deep-link access were also checked. Notification permission and scheduling of 60 future dose reminders succeeded. Future delivery and formal frame-rate benchmarks were not measured. A bundle export alone is not an installable APK.

## Installable APK

An Expo project is linked in app.json. The preview profile generates an internal-distribution APK:

```sh
npx eas-cli@latest build --platform android --profile preview
```

Use the resulting Expo build link to download the APK on Android, allow installation for that download source, and open Tapza Care. No Metro server is needed for the preview APK. Download the verified APK: https://expo.dev/artifacts/eas/omr6a0KPf_ioe4jBVqu6sta258r0WGON8xMxZyewVBE.apk . The build and source commit are recorded in `docs/SUBMISSION_STATUS.md`. An APK is for Android; it is not an iOS installation artifact.

## Submission and honest cuts

See `docs/DEMO_SCRIPT.md` for the 2–3 minute demo sequence and `AI_LOG.md` for assistance and rejected approaches. This repository contains actual development commits; no timestamps or 48-hour history were fabricated. Human time was not measured, so no invented hour total is reported. Work was performed with Codex during this session on 19 November 2026.

The email conflicts between 24 and 48 hours; the attached PDF specifies 48 hours. Confirm the intended deadline with HR before relying on the longer window.

Optional shared-element transitions, dark mode and a full E2E suite are omitted. Family members are illustrative sample data; real family CRUD and service checkout are outside the core assessment slice. Images are the supplied prototype's remote Pexels URLs and need a connection for their first load. Translation coverage is intentionally partial. Mock reservations reset with the process; patient booking history persists on-device.

Native screenshots are in `docs/screenshots/`; the real Android recording is `docs/tapza-care-android-demo.mp4` (2× speed, no narration, with a final reminder-confirmation still). The installable APK is built and verified on-device. A GitHub remote/push and final submission remain; no submission email has been sent. See `docs/SUBMISSION_STATUS.md`.
