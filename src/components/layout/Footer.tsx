import * as React from "react";
import Link from "next/link";
import { Shield, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Ethos */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-600 text-white font-bold">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-base text-white">SecuTrail</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A privacy-first, verified decision-support platform bridging prevention education and trauma-informed survivor triage. Built on the core principle: <span className="text-white italic">&ldquo;Verified information. Private support. Your choice.&rdquo;</span>
            </p>
            <div className="rounded border border-amber-900/60 bg-amber-950/40 p-3 text-[11px] text-amber-200/90 leading-relaxed max-w-md">
              <strong className="block font-semibold text-amber-200 mb-0.5 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                Immediate Life Threat:
              </strong>
              If you are in immediate physical danger, dial <strong>112</strong> (National Emergency) or <strong>1091</strong> (Women Helpline in India) from a safe location.
            </div>
          </div>

          {/* Platform Sections */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Platform Tracks
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/awareness" className="hover:text-white transition-colors">
                  Awareness & Prevention Track
                </Link>
              </li>
              <li>
                <Link href="/survivor" className="hover:text-white transition-colors">
                  Survivor Support & Triage
                </Link>
              </li>
              <li>
                <Link href="/survivor/assistant" className="hover:text-white transition-colors">
                  Verified AI Decision Assistant
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Verified Resource Directory
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Center & State Purge
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Verification & Safety
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Resource Verification Engine
                </Link>
              </li>
              <li>
                <Link href="/privacy#quick-exit" className="hover:text-white transition-colors">
                  Quick Exit Mechanism
                </Link>
              </li>
              <li>
                <Link href="/privacy#threat-model" className="hover:text-white transition-colors">
                  Zero-PII Threat Model
                </Link>
              </li>
              <li className="pt-2 text-[10px] text-slate-500">
                Data strictly audited under BNS 2023, MoHFW Protocols, and NALSA Guidelines.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} SecuTrail Platform. Built for survivor autonomy and community safety.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400">
              Privacy Commitments
            </Link>
            <span>•</span>
            <Link href="/resources" className="hover:text-slate-400">
              Source Registry
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-400">
              Audit Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
