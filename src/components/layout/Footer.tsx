import * as React from "react";
import Link from "next/link";
import { Shield, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground text-xs transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Ethos */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-base text-foreground">SecuTrail</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
              A privacy-first, verified decision-support platform bridging prevention education and trauma-informed survivor triage. Built on the core principle: <span className="text-foreground italic font-medium">&ldquo;Verified information. Private support. Your choice.&rdquo;</span>
            </p>
            <div className="rounded-xl border border-border bg-muted/50 p-3 text-[11px] text-muted-foreground leading-relaxed max-w-md">
              <strong className="block font-semibold text-foreground mb-0.5 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" />
                Immediate Life Threat:
              </strong>
              If you are in immediate physical danger, dial <strong className="text-foreground">112</strong> (National Emergency) or <strong className="text-foreground">1091</strong> (Women Helpline in India) from a safe location.
            </div>
          </div>

          {/* Platform Sections */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Platform Tracks
            </h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link href="/awareness" className="hover:text-foreground hover:underline transition-colors">
                  Awareness &amp; Prevention Track
                </Link>
              </li>
              <li>
                <Link href="/survivor" className="hover:text-foreground hover:underline transition-colors">
                  Survivor Support &amp; Triage
                </Link>
              </li>
              <li>
                <Link href="/survivor/assistant" className="hover:text-foreground hover:underline transition-colors">
                  Verified AI Decision Assistant
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-foreground hover:underline transition-colors">
                  Verified Resource Directory
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">
                  Privacy Center &amp; State Purge
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Verification &amp; Safety
            </h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>
                <Link href="/admin" className="hover:text-foreground hover:underline transition-colors">
                  Resource Verification Engine
                </Link>
              </li>
              <li>
                <Link href="/privacy#quick-exit" className="hover:text-foreground hover:underline transition-colors">
                  Quick Exit Mechanism
                </Link>
              </li>
              <li>
                <Link href="/privacy#threat-model" className="hover:text-foreground hover:underline transition-colors">
                  Zero-PII Threat Model
                </Link>
              </li>
              <li className="pt-2 text-[10px] text-muted-foreground/80">
                Data strictly audited under BNS 2023, MoHFW Protocols, and NALSA Guidelines.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SecuTrail Platform. Built for survivor autonomy and community safety.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy Commitments
            </Link>
            <span>•</span>
            <Link href="/resources" className="hover:text-foreground hover:underline">
              Source Registry
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-foreground hover:underline">
              Audit Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
