import * as React from "react";
import Link from "next/link";
import { Shield, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#004225]/20 bg-[#004225] text-[#FFFDD0] text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Ethos */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FFFDD0] text-[#004225] font-bold shadow-xs">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-base text-[#FFFDD0]">SecuTrail</span>
            </div>
            <p className="text-[#FFFDD0]/80 text-xs leading-relaxed max-w-md">
              A privacy-first, verified decision-support platform bridging prevention education and trauma-informed survivor triage. Built on the core principle: <span className="text-[#FFFDD0] italic">&ldquo;Verified information. Private support. Your choice.&rdquo;</span>
            </p>
            <div className="rounded border border-[#FFFDD0]/25 bg-[#00361E] p-3 text-[11px] text-[#FFFDD0]/90 leading-relaxed max-w-md">
              <strong className="block font-semibold text-[#FFFDD0] mb-0.5 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-[#FAF7BA] shrink-0" />
                Immediate Life Threat:
              </strong>
              If you are in immediate physical danger, dial <strong>112</strong> (National Emergency) or <strong>1091</strong> (Women Helpline in India) from a safe location.
            </div>
          </div>

          {/* Platform Sections */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#FFFDD0] uppercase tracking-wider text-[11px]">
              Platform Tracks
            </h4>
            <ul className="space-y-1.5 text-[#FFFDD0]/80">
              <li>
                <Link href="/awareness" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Awareness & Prevention Track
                </Link>
              </li>
              <li>
                <Link href="/survivor" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Survivor Support & Triage
                </Link>
              </li>
              <li>
                <Link href="/survivor/assistant" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Verified AI Decision Assistant
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Verified Resource Directory
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Privacy Center & State Purge
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#FFFDD0] uppercase tracking-wider text-[11px]">
              Verification & Safety
            </h4>
            <ul className="space-y-1.5 text-[#FFFDD0]/80">
              <li>
                <Link href="/admin" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Resource Verification Engine
                </Link>
              </li>
              <li>
                <Link href="/privacy#quick-exit" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Quick Exit Mechanism
                </Link>
              </li>
              <li>
                <Link href="/privacy#threat-model" className="hover:text-[#FFFDD0] hover:underline transition-colors">
                  Zero-PII Threat Model
                </Link>
              </li>
              <li className="pt-2 text-[10px] text-[#FFFDD0]/65">
                Data strictly audited under BNS 2023, MoHFW Protocols, and NALSA Guidelines.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-[#FFFDD0]/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FFFDD0]/65">
          <p>
            © {new Date().getFullYear()} SecuTrail Platform. Built for survivor autonomy and community safety.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#FFFDD0] hover:underline">
              Privacy Commitments
            </Link>
            <span>•</span>
            <Link href="/resources" className="hover:text-[#FFFDD0] hover:underline">
              Source Registry
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#FFFDD0] hover:underline">
              Audit Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
