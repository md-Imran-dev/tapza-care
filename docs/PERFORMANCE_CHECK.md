# Android development validation — 2026-11-20

## Build and device

- V2503, Android 17, ARM64; existing patient data preserved.
- Locally built standalone release-mode APK, approximately 31 MB. Installed package flags did not include DEBUGGABLE. Native shared-transition flag enabled.
- Uses the existing local debug signing key for sideload testing; this is not Play upload-key verification.
- Build: `cd android && ./gradlew :app:assembleRelease -PreactNativeArchitectures=arm64-v8a`.
- Artifact: `android/app/build/outputs/apk/release/app-release.apk` (ignored by Git).

## Rendering sample

Android `dumpsys gfxinfo` counters were reset after warm launch. Native device input exercised Home scrolling in both directions, directory navigation, opening/closing doctor booking, opening service booking, and dragging the service sheet down to dismiss it. The sheet visibly returned to Home.

- Total rendered frames: 1,208.
- Android-reported janky frames: 11 (0.91%).
- Legacy janky-frame counter: 494 (40.89%). Both counters are recorded; they are not interchangeable.
- Frame-time percentiles: p50 9 ms, p90 14 ms, p95 15 ms, p99 22 ms.
- This limited warm interaction sample is not a sustained FPS benchmark, a cold-start benchmark, or proof of zero stutter at all refresh rates. The high legacy counter warrants keeping this limitation explicit.
- A separate uninterrupted doctor-photo sample exercised directory → details via the name, directory → booking via Book Now, and directory → details via the portrait, with Android Back between entries: 846 frames; 45 janky (5.32%), legacy 256 (30.26%); p50 9 ms, p90 14 ms, p95 17 ms, p99 32 ms; zero slow bitmap uploads. Photo navigation works, but these results do not establish consistently smooth animation. Samples preceded the final status-bar contrast-only adjustment.

## Other checks

- Lint, strict TypeScript, and 40 tests in 14 suites passed.
- Main text and tab foreground/background contrast pairs tested at >= 4.5:1 in both normal/festival themes.
- Home and service-booking layouts checked at 130% system font scale. Icon containers and tab labels adjusted to accommodate enlarged text. Both themes visually checked; original 100% scale and normal theme restored afterward.
- All Pressable controls expose button roles; shared buttons expose disabled state. Existing actionable controls use at least 44-point targets; tests cover key disabled/dismissal behavior.
- No full screen-reader audit, 200% text audit, iOS audit, or long-running stress benchmark is claimed.
- Required tests restored to Git tracking. No commit/push performed for this cleanup.
