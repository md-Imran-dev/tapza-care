# AI assistance log

I used Codex throughout this assignment for implementation, debugging, tests and documentation. The entries below summarise the prompts and decisions; they are not a verbatim transcript. A passing test or generated answer was not treated as proof that a native flow worked.

## Prompts that shaped the app

| Request                                                                                                                    | Result                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read the assessment and supplied prototype carefully.                                                                      | Used the prototype as a visual reference, then built the missing native behaviour and mock API flows.                                                                                  |
| Follow the existing onboarding/phone/OTP flow, with no guests.                                                             | Added protected Expo Router routes, session hydration and first-time profile setup. OTP remains explicitly mocked.                                                                     |
| Match the doctor cards, details and bottom bar references; use reusable components.                                        | Extracted shared doctor cards/details/photo UI and adapted layouts for mobile and larger text.                                                                                         |
| Open Book visit with a doctor selected, allow swiping between doctors, and keep scheduling open when switching categories. | Revised the original directory-first approach into an in-sheet doctor picker with a separate previously consulted filter.                                                              |
| Clinic services should not open a doctor consultation.                                                                     | Added service-specific slots, location/address validation and booking metadata.                                                                                                        |
| Make language changes work and show progress.                                                                              | Added a shared English/Hindi/Telugu catalog, per-patient persistence and a loading state.                                                                                              |
| Check remaining requirements carefully and restore the required tests.                                                     | Restored tracked tests, next-slot labels, service-sheet gestures/success animation, theme tokens, loading skeletons and accessibility fixes.                                           |
| The photo animation is rough and too fast.                                                                                 | Slowed photo motion to 500ms, removed image crossfade, adjusted navigation fades, and enabled transform tracking after Reanimated reported stale values. Smoothness remains imperfect. |

## Suggestions I rejected or changed

- **Guest access:** excluded as requested; patient routes share an auth guard.
- **Copying prototype starter code unchanged:** it did not provide the required persistence and failure handling. The visual reference was retained, not its unsupported claims.
- **A separate server or extra storage library:** the Axios mock adapter and AsyncStorage were enough for this assessment. SecureStore is used for native sessions.
- **Opening a full doctor directory before scheduling:** changed after feedback to keep doctor selection and availability in the same sheet.
- **Sending every service to one doctor:** replaced with an independent service booking flow.
- **Fixed list heights:** avoided for variable sections and scaled text, where inaccurate measurements would break scrolling.
- **Ignoring tests in Git:** initially done at my request, then reversed after the requirement audit. Required tests are tracked again.
- **Calling a successful bundle export a verified app:** native installation and interaction checks were recorded separately.

## Validation and limits

Codex ran lint, TypeScript and 40 tests, and used the connected Android phone for selected flow, layout and release-rendering checks. Unit tests mock native animation. The measured photo sample still had 5.32% janky frames; the later transform-tracking fix has not been rebenchmarked. Details are in [PERFORMANCE_CHECK.md](docs/PERFORMANCE_CHECK.md).

Dark mode, automated E2E tests and production integrations were left out. iOS, timed notification delivery and a full accessibility audit were not verified. Existing demo media and the shared preview APK predate the latest UI changes.

Active human hours were not tracked. No hour total, commit history or verification result has been invented. This log documents AI involvement; it does not replace understanding and reviewing the code before the follow-up interview.
