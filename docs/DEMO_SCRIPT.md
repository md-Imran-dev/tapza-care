# Tapza Care demo recording (2–3 minutes)

Record an actual Android run when a device is available. Do not present web captures as Android evidence.

1. 0:00–0:25: Open app → onboarding → valid Indian mobile number → demo OTP `123456` → name. No guest button. Reopening preserves the signed-in session.
2. 0:25–0:55: Scroll the normal home. Show the separate backgrounds, section reveals, collapsing header, parallax image, categories, services and doctor cards. Profile → switch Diwali → home: colours, banner, items and section order change.
3. 0:55–1:25: Doctor → book → choose a date and slot → confirm → success animation → bookings. Open a prescription → morning/afternoon/night → mark a dose taken. Reload and show it remains taken.
4. 1:25–2:00: Profile → demo lab → booking conflict ON → back to doctor → attempt booking → error → optimistic item rolls back. Turn conflict OFF → retry succeeds. Show slot-failure retry and empty-slot states using their independent switches.
5. 2:00–2:25: Fail config ON → refresh home → cached layout remains visible, other tabs work. Turn OFF → Retry home. Slow network shows matching skeletons. Offline booking queues; reconnect syncs through the mocked POST endpoint.
6. 2:25–2:50: Reminders → enable notifications on device → show scheduled dose notice. Switch Hindi/Telugu header labels. Show admin JSON editing. Sign out → patient screens require login again.

Capture screenshots of login, normal home, festival home, booking sheet, conflict state and prescription schedule under `docs/screenshots/`. Attach the recording under `docs/` or link its GitHub-hosted media in the README.
