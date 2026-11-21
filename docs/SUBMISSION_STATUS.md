# Submission status

Updated 21 November 2026.

- Core flows are implemented: config-driven Home, doctor/service booking, prescriptions and demo failure controls. See [README](../README.md).
- Current validation: lint, strict TypeScript, 46 tests in 16 suites, and Android/iOS/web bundle exports passed.
- Latest native build: local ARM64 **debug** APK at `android/app/build/outputs/apk/debug/app-debug.apk` (about 79 MB), signature verified. It requires Metro. No phone was connected for installation after the MMKV refactor.
- A fresh standalone APK and device smoke test are needed for the final source. Earlier device checks and frame measurements do not validate this new binary.
- Repository: <https://github.com/md-Imran-dev/tapza-care>.
- User-provided install link: <https://install.shareipa.com/cmh2e4>. Its source revision has not been verified here.
- Demo video: <https://drive.google.com/file/d/1Q0pDDynCdzMMFk3Req_w3w3vJVvFjOFL/view?usp=drivesdk>. This link was provided by the user; it has not been checked against the final refactor.
- Screenshot archive: [screnn shots of app.zip](screnn%20shots%20of%20app.zip). Older individual screenshots and the repository video were removed in favour of the supplied artifacts.
- Final submission delivery has not been verified in this session.

## Earlier build evidence

The EAS preview for commit `c36e34f` was installed and exercised on a V2503 / Android 17 device. It predates the UI and MMKV changes:

- [Build details](https://expo.dev/accounts/birthtimerecorderpro/projects/tapza-care/builds/cd5e9c8d-604d-4d08-ab8f-980f723d70d3)
- [Earlier preview APK](https://expo.dev/artifacts/eas/omr6a0KPf_ioe4jBVqu6sta258r0WGON8xMxZyewVBE.apk)

Notification permission/scheduling passed in that earlier iteration; timed delivery and iOS device behaviour remain unverified. [Optimization notes](OPTIMIZATION.md) describe the current implementation and its limits.
