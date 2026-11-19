# AI assistance log

## Prompts that shaped this implementation

- User supplied the Tapza Care assessment PDF and a React/Vite prototype ZIP and asked for a careful read-only review. Codex inspected the source and identified that native implementation, persistence, real mock endpoint behaviour and submission artifacts were absent.
- User supplied a source export with suggested conversion instructions. Those instructions were treated as reference content, not as an instruction to execute immediately.
- User requested the app screens match the prototype screenshots. Codex created Expo Router patient screens using the reference content and images.
- User asked whether all assessment flows were complete. Codex identified the remaining gaps instead of claiming the UI constituted a completed assessment.
- User requested full completion using Zotto's app flow, explicitly excluding guests, with screen completion before optimization. Codex inspected the actual Zotto auth/secure route layouts and implemented onboarding, phone/OTP verification, first-time profile setup and protected patient routes. The OTP backend remains deliberately mocked and is labelled as such.

## Decisions and rejected approaches

- Kept the prototype's teal/festival visual direction and realistic Indian sample content; rejected copying its website marketing/audit page into the app.
- Rejected the prototype's incomplete starter snippets: they referenced undefined helpers, exposed an always-redirecting root and claimed persistence/sync that did not exist.
- Rejected a guest bypass. Every patient route sits under a guarded layout; sessions hydrate before navigation.
- Chose AsyncStorage for non-secret demo persistence so the app can run in Expo Go; native session material uses SecureStore, and browser demo sessions use sessionStorage. Did not add an MMKV/Nitro dependency just to mimic the handoff's suggested stack; the PDF permits any storage choice.
- Implemented the five comparable backend endpoints through an Axios mock adapter. No external production service is contacted. Kept network controls independently configurable.
- Added synchronous optimistic booking insertion followed by backend reconciliation; 409 removes only the rejected optimistic item. Offline requests persist with stable IDs, replay on simulated reconnect, and reconcile conflicts.
- Used FlatList with memoized sections and viewability-driven Reanimated reveals. Rejected fixed getItemLayout heights for variable section layouts and OS-scaled text because inaccurate heights break scrolling.
- Centralized colours, spacing and typography in the theme module rather than retaining literal styles throughout components. Improved the festival secondary-text colour for readability.
- Added focused tests for validation, section rendering, auth and booking state rather than treating the prototype's static “tests passed” cards as evidence.

## Ownership and limits

Code and test tooling were authored/edited with Codex. Documentation records actual work and verification; it does not claim unrecorded human hours, native device checks, a fabricated 48-hour commit history, or a demo video that was not recorded. Review `README.md` for the current verification and submission status.
