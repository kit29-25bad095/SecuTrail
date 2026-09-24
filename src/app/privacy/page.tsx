"use client";

import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  LogOut,
  Trash2,
  EyeOff,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { clearSecuTrailClientState } from "@/lib/privacy/sessionCleanup";

export default function PrivacyPage() {
  const [clearedNotice, setClearedNotice] = React.useState(false);

  const handleManualPurge = () => {
    clearSecuTrailClientState();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="outline" className="text-xs uppercase font-bold tracking-wider">
          Privacy Architecture &amp; Threat Model
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          Privacy Center &amp; Threat Model
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Trauma-informed technology requires transparent truth. Here is exactly what SecuTrail does, what it does not store, and the real-world limitations you should know.
        </p>
      </div>

      {/* Manual Purge Action Bar */}
      <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Trash2 className="h-6 w-6 text-red-600 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Immediate Client-State Purge
            </h2>
            <p className="text-xs text-muted-foreground">
              Instantly scrub all SecuTrail temporary session data, triage choices, and notes from this device.
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleManualPurge}
          className="text-xs gap-1.5 shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Wipe All Local Data Now</span>
        </Button>
      </div>

      {clearedNotice && (
        <Alert variant="success" className="animate-in fade-in-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Local State Purged</AlertTitle>
          <AlertDescription className="text-xs">
            All SecuTrail-owned storage keys, triage preferences, and ephemeral tokens have been removed from your browser.
          </AlertDescription>
        </Alert>
      )}

      {/* ------------------------------------------------------------ */}
      {/* WHAT WE STORE VS WHAT WE DO NOT STORE */}
      {/* ------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WHAT WE STORE */}
        <Card className="border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>What SecuTrail Stores</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <p>
              • <strong>Ephemeral Session Identifier</strong>: A random cryptographic token (e.g. <code className="bg-muted px-1 rounded">sess_9a8f...</code>) that expires automatically after 30 minutes of inactivity.
            </p>
            <p>
              • <strong>Active Triage Selections</strong>: Temporary checkboxes (Medical, Emotional, Legal) so the application can surface relevant options.
            </p>
            <p>
              • <strong>Temporary Location Selection (If consented)</strong>: State/District selected by you to filter local hospital rosters.
            </p>
            <p>
              • <strong>Awareness Module Completion Counter</strong>: Kept in temporary local browser storage so you can see your learning progress without creating an account.
            </p>
          </CardContent>
        </Card>

        {/* WHAT WE DO NOT STORE */}
        <Card className="border-red-200 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-red-900 dark:text-red-200 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span>What SecuTrail NEVER Stores</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <p>
              • <strong>Zero Compulsory Accounts</strong>: No names, phone numbers, email addresses, or passwords required.
            </p>
            <p>
              • <strong>Zero Permanent Chat Transcripts</strong>: User questions in the decision assistant are processed in transient memory and never written to a permanent chat database.
            </p>
            <p>
              • <strong>Zero GPS Coordinates</strong>: We never request hardware device geolocation or exact physical coordinates.
            </p>
            <p>
              • <strong>Zero Third-Party Advertising Pixels</strong>: No Meta pixels, Google Ad tags, or commercial tracking beacons.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CRITICAL HONESTY: WHAT QUICK EXIT CANNOT ERASE */}
      {/* ------------------------------------------------------------ */}
      <Card className="border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span>Real-World Safety Limitations: What Quick Exit Cannot Erase</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs sm:text-sm text-amber-950/90 dark:text-amber-200/90 leading-relaxed">
          <p>
            We will never make false claims such as <em>&ldquo;No trace exists&rdquo;</em> or <em>&ldquo;Nobody can see your visit.&rdquo;</em> Quick Exit helps you leave SecuTrail instantly and scrubs our application memory, but it has important physical limits:
          </p>

          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">•</span>
              <span>
                <strong>Browser History:</strong> Web browsers (Chrome, Safari, Edge) record URLs visited unless you use Private / Incognito browsing. To remove SecuTrail from history, manually clear your browser history or use an incognito window.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">•</span>
              <span>
                <strong>Network &amp; Wi-Fi Logs:</strong> If you are connected to a shared home Wi-Fi, school network, or office network, the network router or Internet Service Provider (ISP) may log domain name queries (<code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">secutrail.org</code>).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">•</span>
              <span>
                <strong>Spyware &amp; Device Monitoring:</strong> If your phone or computer has stalkerware, parental monitoring software, or keyloggers installed, the software can capture keystrokes or screen recordings regardless of website controls.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-700">•</span>
              <span>
                <strong>Downloaded Files &amp; Screenshots:</strong> Any manual screenshots taken or phone calls placed to helplines will appear in your device&apos;s recent call log and photo gallery.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------ */}
      {/* DETAILED TECHNICAL PRIVACY SECTIONS */}
      {/* ------------------------------------------------------------ */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Privacy Policy &amp; Security Specifications
        </h2>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="rounded-lg border p-4 bg-card space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>1. Session Lifetime &amp; Expiration Protocol</span>
            </h3>
            <p>
              Survivor sessions exist purely in transient RAM. If a user is inactive for more than 30 minutes, the cryptographic session token expires automatically. When a session expires or is invalidated, all temporary association keys are deleted by the server garbage collector.
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-card space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>2. Progressive Location Consent Framework</span>
            </h3>
            <p>
              Access to geographic resources follows an explicit opt-in model. By default, SecuTrail displays nationwide toll-free crisis helplines. Only when a user explicitly chooses to locate local district facilities does the application accept state/district input. This geographic filter is never linked to an identity.
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-card space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LogOut className="h-4 w-4 text-amber-600" />
              <span>3. Quick Exit Architecture</span>
            </h3>
            <p>
              When Quick Exit is triggered (via button click or double-pressing <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">ESC</kbd>), the client synchronously executes <code className="bg-muted px-1 rounded">window.location.replace(NEXT_PUBLIC_QUICK_EXIT_URL)</code>. This avoids creating an additional entry in the browser navigation back-stack while simultaneously purging SecuTrail-namespaced local keys.
            </p>
          </div>

          <div className="rounded-lg border p-4 bg-card space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-blue-600" />
              <span>4. Input Guardrail Sanitization</span>
            </h3>
            <p>
              Any text entered into our decision support assistant is immediately pre-screened by our regex guardrail layer. If an email address, Indian phone number, or 12-digit Aadhaar pattern is detected, it is immediately masked with <code className="bg-muted px-1 rounded">[REDACTED_...]</code> before reaching the AI grounding pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
