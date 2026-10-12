import * as React from "react";
import { AwarenessNav } from "@/components/awareness/AwarenessNav";

export default function AwarenessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 bg-[#FFFDD0] min-h-screen">
      {/* Sub-header Navigation across all Awareness Track routes */}
      <AwarenessNav />

      {/* Main Track Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
