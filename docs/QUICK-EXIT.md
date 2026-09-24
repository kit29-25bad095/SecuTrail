# SecuTrail — Quick Exit Architecture & Technical Specification

## 1. Safety Promise & Intent
The **Quick Exit** mechanism is modeled on the industry-leading safety patterns of trauma-informed crisis systems and *Find A Helpline*. Its sole purpose is to allow a user browsing sensitive support, medical, or legal materials to immediately escape to a benign, neutral website if an unsafe person enters the room.

---

## 2. Core Operational Requirements & Implementation

### 1. Zero Confirmation Dialogs
Quick Exit **must never** prompt:
- *"Are you sure you want to leave?"*
- *"Confirm exit"*
- *"Cancel or Continue"*

The action executes immediately upon interaction without any blocking UI.

### 2. Immediate History Replacement
Instead of `router.push()` (which creates a back-button entry allowing someone to click 'Back' to view SecuTrail), the system invokes:
```typescript
window.location.replace(neutralUrl);
```
This overwrites the current entry in the browser's navigation history so the "Back" button cannot navigate directly back to SecuTrail.

### 3. Configurable Neutral Destination
The exit destination is driven by an environment variable:
```env
NEXT_PUBLIC_QUICK_EXIT_URL="https://weather.com"
```
Developers or deployed environments can adjust this destination to any benign, high-traffic website (e.g., weather forecast, news, or neutral search engine) without modifying component code.

### 4. Selective State Purge
While the redirect is taking place, `clearSecuTrailClientState()` instantly purges all `secutrail_*` localStorage keys and all sessionStorage:
- Clears `secutrail_session_id`, `secutrail_session`
- Clears `secutrail_triage`, `secutrail_location`, `secutrail_options`
- Clears `secutrail_awareness_progress`
- Purges all temporary `sessionStorage`
- Leaves unrelated third-party keys intact to prevent suspicious total wipes

### 5. Fire-and-Forget Server Session Invalidation
Quick Exit notifies the server via a non-blocking beacon:
```typescript
if (navigator.sendBeacon) {
  navigator.sendBeacon("/api/session/exit", new Blob([payload], { type: "application/json" }));
} else {
  fetch("/api/session/exit", { keepalive: true, body: payload });
}
```
**Crucial Safety Rule**: Quick Exit **never** awaits the server response. If the network is slow, throttling, or offline, the client redirect and state wipe still occur without hesitation.

### 6. Double-Escape Keyboard Listener
- Pressing `ESC` once does **not** trigger an exit (to prevent accidental triggers during normal modal dismissal).
- Pressing `ESC` twice within 1000ms (~1 second) triggers the full Quick Exit sequence.
- Implemented as a reusable hook: `useQuickExit()`.

### 7. HTML Anchor Fallback
For environments where JavaScript is disabled, blocked, or crashes, Quick Exit buttons render semantic `<a href="https://weather.com">` links, ensuring basic escape capability remains functional.

### 8. Mobile & Screen Reader Accessibility
- Touch targets are minimum 44px height on mobile (`min-h-[40px]` to `min-h-[48px]`).
- Screen-reader announcement: `aria-label="Quick Exit: Immediately leave this page and clear session data"`.
- Keyboard announcement: `aria-keyshortcuts="Escape Escape"`.
- Operable via Keyboard `Enter` and `Space`.

---

## 3. Honest Limitations & Threat Model Reality

While Quick Exit protects against immediate casual glance detection when someone walks into the room, **it cannot overcome the physics of device access or client-side operating system logging**.

SecuTrail explicitly and honestly documents that Quick Exit **CANNOT** erase:

1. **Browser History & URL Autocomplete**:
   While `location.replace()` replaces the immediate page in the active session history, the URL remains recorded in the browser's persistent disk history unless private/incognito browsing mode was used.

2. **Network Logs & ISP / Wi-Fi Router Inspection**:
   DNS queries and TLS SNI headers (e.g. `secutrail.org`) are logged by Wi-Fi routers, enterprise firewalls, and Internet Service Providers. Quick Exit cannot erase router logs.

3. **Screenshots & Screen Recording**:
   If an abuser or employer has configured background screen-capture software or spyware on the device, past frames are already recorded.

4. **Spyware & Device Monitoring Keyloggers**:
   Stalkerware, mSpy, parental control software, or hardware keyloggers record keystrokes in real time before Quick Exit is triggered.

5. **Information Already Copied Elsewhere**:
   Any notes taken, phone numbers dialed directly, or files exported remain outside SecuTrail's reach.

---

## 4. Recommended Survivor Safety Protocols

For maximum personal safety when browsing in high-risk environments:
- Use a **trusted secondary device** (a public library computer, school lab, or a friend's phone) rather than a shared or suspected monitored device.
- Always browse in **Private / Incognito Window** mode.
- Manually clear browser history after closing all tabs if not in incognito.
- In immediate physical danger, dial **112** (National Emergency Response) or **1091** (Women Helpline) from a safe phone immediately.
