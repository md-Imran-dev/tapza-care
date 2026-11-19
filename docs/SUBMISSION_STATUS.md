# Submission status

- Required UI/core flows: implemented; see README.
- Unit/component tests: 15 passed across four suites.
- Lint/typecheck/Expo Doctor: passed during development.
- Android and web bundle exports: passed.
- Native release checks passed on a V2503 phone running Android 17: installation/launch, onboarding, phone/OTP/profile setup, both themes, prescription dose marking, empty slots, 409 conflict, drag-to-dismiss, successful booking and persisted history after restart, and sign-out/deep-link route protection. Notification permission and scheduling of 60 upcoming dose reminders succeeded; future notification delivery was not time-waited.
- Expo project: https://expo.dev/accounts/birthtimerecorderpro/projects/tapza-care
- APK: build succeeded for commit `c36e34f`.
  - Build: https://expo.dev/accounts/birthtimerecorderpro/projects/tapza-care/builds/cd5e9c8d-604d-4d08-ab8f-980f723d70d3
  - Download: https://expo.dev/artifacts/eas/omr6a0KPf_ioe4jBVqu6sta258r0WGON8xMxZyewVBE.apk
- Native screenshots: `docs/screenshots/`.
- Android demo: `docs/tapza-care-android-demo.mp4`, recorded on the phone and combined at 2× speed with a final confirmation still; duration 2:56, fitting the 2–3 minute requirement.
- GitHub repository: no remote configured; local commits preserve actual development work.
- Submission email: not sent.

The demo account was signed out after testing to cancel its scheduled medicine reminders. The APK remains installed on the connected phone.
