# SecuTrail — Privacy Model & Guarantees

## 1. Zero-PII Policy
SecuTrail enforces a **Zero Personally Identifiable Information (Zero-PII)** architecture for survivors.

| Data Category | Retention Policy | Storage Mechanism |
|---|---|---|
| User Identity / Accounts | Not Collected | No account creation required |
| Chat Transcripts | 0 Seconds | In-memory only (wiped on exit/timeout) |
| Triage Selections | Session only | Client-side React state |
| IP Addresses | Not Stored | Stripped / Not persisted |
| Geolocation | Permission prompt | Never stored on server; used client-side for distance sort |

---

## 2. Quick Exit Protocol (Technical Flow)

When the user clicks **Quick Exit** or presses `Escape` twice:
1. **Memory Wipe**: Client React state is immediately nulled.
2. **Storage Purge**: `sessionStorage.clear()`, `localStorage.clear()`.
3. **Cookie Eradication**: Any ephemeral cookies are expired.
4. **History Obfuscation**: `window.location.replace("https://www.google.com/search?q=weather+forecast")`.
5. **No Confirmation**: Zero prompts ("Are you sure?") to ensure sub-second evasion.

---

## 3. Honest Privacy Transparency
SecuTrail explicitly informs the user:
> **Important**: Quick Exit can clear this browser window and local cache, but it **cannot** erase your device's global browser history if synced to the cloud, network/Wi-Fi router logs, keystroke loggers, or spyware installed on your phone. If you are on a monitored device, consider using private browsing or a trusted friend's device.
