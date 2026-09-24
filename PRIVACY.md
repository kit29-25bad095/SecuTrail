# SecuTrail — Privacy Architecture & Guarantees

## 1. Ethical Transparency
SecuTrail will never claim:
- *"Browser history is deleted."*
- *"No trace exists."*
- *"Nobody can see your visit."*

We communicate real-world technical boundaries honestly so survivors can make safe, informed choices.

---

## 2. What SecuTrail Stores vs. What We Never Store

### What We Store (Temporary / Ephemeral Only)
- **Anonymous Session Token**: Random cryptographic string (e.g. `sess_8f3a...`) kept in memory with a 30-minute inactivity TTL.
- **Triage Domain Checkboxes**: Active choices (Medical, Emotional, Legal) in browser session memory.
- **Location Preference (If explicitly consented)**: State and District names selected to filter facility rosters.
- **Awareness Progress Counter**: Anonymous local array of completed module IDs in `localStorage`.

### What We NEVER Store
- **User Names, Email Addresses, or Phone Numbers**: Zero registration forms.
- **Compulsory Passwords or Social Logins**: No Google/Meta/OAuth tracking.
- **Permanent Chat Logs**: Queries are evaluated in memory and discarded.
- **GPS Coordinates**: No hardware geolocation API access.
- **Third-Party Trackers**: No Meta pixels, analytics beacons, or ad networks.

---

## 3. Real-World Limitations Survivors Must Know

1. **Browser History**: Standard web browsers record visited URLs unless Private/Incognito mode is used.
2. **Network & Wi-Fi Logs**: Local Wi-Fi routers or ISP DNS resolvers may log domain connections.
3. **Stalkerware & Keyloggers**: If device monitoring software is installed on the user's phone or laptop, it can record keystrokes or screenshots.
4. **Recent Calls & Photos**: Phone numbers called or screenshots captured appear in native device logs.

---

## 4. Client State Purge Mechanism

SecuTrail selectively purges only its own namespaced storage keys without wiping unrelated website data:
- `secutrail_session`
- `secutrail_session_id`
- `secutrail_chat`
- `secutrail_triage`
- `secutrail_location`
- `secutrail_state`
- `secutrail_options`
- `secutrail_awareness_progress`

This can be triggered manually via the Privacy Center (`/privacy`), or automatically upon clicking **Quick Exit**.
