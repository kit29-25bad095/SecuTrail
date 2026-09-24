# SecuTrail — Quick Exit Architecture & Technical Specification

## 1. Safety Promise & Intent
The **Quick Exit** mechanism is modeled on the industry-leading safety patterns of *Find A Helpline*. Its sole purpose is to allow a user who is browsing sensitive support materials to immediately escape to a benign, neutral website if an unsafe person enters the room.

---

## 2. Core Operational Requirements

### 1. Zero Confirmation Dialogs
Quick Exit **must never** prompt:
- *"Are you sure you want to leave?"*
- *"Confirm exit"*
- *"Cancel or Continue"*
The action must execute immediately upon interaction.

### 2. Immediate History Replacement
Instead of `router.push()` (which creates a back-button entry allowing someone to click 'Back' to view SecuTrail), the system invokes:
```typescript
window.location.replace(neutralUrl);
```

### 3. Configurable Neutral Destination
The exit destination is driven by an environment variable:
```env
NEXT_PUBLIC_QUICK_EXIT_URL="https://weather.com"
```
This ensures developers and operators can change the fallback site without modifying component code.

### 4. Selective State Purge
While the redirect is taking place, `clearSecuTrailClientState()` instantly clears all `secutrail_*` localStorage keys and all sessionStorage.

### 5. Fire-and-Forget Server Session Invalidation
Quick Exit notifies the server via:
```typescript
if (navigator.sendBeacon) {
  navigator.sendBeacon("/api/session/exit", payload);
} else {
  fetch("/api/session/exit", { keepalive: true, ... });
}
```
**Crucial Rule**: Quick Exit **never** awaits the server response. If the network is slow or offline, the client redirect and state wipe still occur without hesitation.

### 6. Double-Escape Keyboard Listener
- Pressing `ESC` once does **not** trigger an exit (to prevent accidental triggers during normal modal dismissal).
- Pressing `ESC` twice within ~1000ms triggers the full Quick Exit sequence.
- Implemented as a reusable hook: `useQuickExit()`.

### 7. HTML Anchor Fallback
For environments where JavaScript is disabled or crashes, Quick Exit buttons render semantic `<a href="https://weather.com">` links, ensuring basic escape capability remains functional.
