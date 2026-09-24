"use client";

import * as React from "react";
import Link from "next/link";
import {
  Database,
  Search,
  Plus,
  ShieldCheck,
  Clock,
  ExternalLink,
  Phone,
} from "lucide-react";
import { useAdmin } from "@/lib/admin/adminStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { VerificationBadge } from "@/components/resources/VerificationBadge";
import { formatDate } from "@/lib/utils";
import { VerificationStatus, VerificationTier } from "@/types";

export default function AdminResourcesPage() {
  const { resources, addResource, updateResource } = useAdmin();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [scopeFilter, setScopeFilter] = React.useState<string>("ALL");
  const [tierFilter, setTierFilter] = React.useState<string>("ALL");

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [serviceType, setServiceType] = React.useState("ONE_STOP_CENTRE");
  const [authorityLevel, setAuthorityLevel] = React.useState<VerificationTier>("TIER_1_OFFICIAL_GOVERNMENT");
  const [sourceOrg, setSourceOrg] = React.useState("Ministry of Women and Child Development (MoWCD)");
  const [sourceUrl, setSourceUrl] = React.useState("https://wcd.nic.in");
  const [geographicScope, setGeographicScope] = React.useState<"NATIONAL" | "STATE" | "DISTRICT">("DISTRICT");
  const [stateName, setStateName] = React.useState("Delhi");
  const [districtName, setDistrictName] = React.useState("Central Delhi");
  const [contact, setContact] = React.useState("");
  const [secondaryContact, setSecondaryContact] = React.useState("");
  const [operatingHours, setOperatingHours] = React.useState("24/7");
  const [is24x7, setIs24x7] = React.useState(true);
  const [availability, setAvailability] = React.useState("Operational 24/7 with on-duty caseworkers");
  const [verificationStatus, setVerificationStatus] = React.useState<VerificationStatus>("PENDING_REVIEW");

  // Filter logic
  const filteredResources = resources.filter((res) => {
    // Search
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      res.name.toLowerCase().includes(term) ||
      res.contact.toLowerCase().includes(term) ||
      (res.state && res.state.toLowerCase().includes(term)) ||
      (res.district && res.district.toLowerCase().includes(term)) ||
      res.serviceType.toLowerCase().includes(term) ||
      (res.sourceOrganization && res.sourceOrganization.toLowerCase().includes(term));

    // Status
    const isExpired = new Date(res.nextReview) < new Date();
    const effectiveStatus = isExpired ? "EXPIRED" : res.verificationStatus;
    const matchesStatus =
      statusFilter === "ALL" || statusFilter === effectiveStatus;

    // Scope
    const matchesScope = scopeFilter === "ALL" || res.geographicScope === scopeFilter;

    // Tier
    const matchesTier = tierFilter === "ALL" || res.authorityLevel === tierFilter;

    return matchesSearch && matchesStatus && matchesScope && matchesTier;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      alert("Name and primary contact are required.");
      return;
    }

    addResource({
      name: name.trim(),
      serviceType,
      authorityLevel,
      sourceOrganization: sourceOrg.trim(),
      sourceUrl: sourceUrl.trim() || null,
      geographicScope,
      state: stateName.trim() || null,
      district: districtName.trim() || null,
      contact: contact.trim(),
      secondaryContact: secondaryContact.trim() || null,
      operatingHours,
      is24x7,
      availability: availability.trim(),
      verificationStatus,
      lastVerified: new Date().toISOString(),
      nextReview: new Date(Date.now() + 86400000 * 90).toISOString(),
      services: [
        {
          category: "LEGAL",
          name: "Immediate Verification & Support",
          isFree: true,
        },
      ],
    });

    setCreateModalOpen(false);
    // Reset fields
    setName("");
    setContact("");
    setSecondaryContact("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-teal-400" />
            <span>Resource Directory Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of statutory emergency, medical, legal, and trauma centres.
            Every entry requires all 8 verification attributes.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Register Discovered Resource
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-slate-900/80 border-slate-800">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <Input
                placeholder="Search by resource name, contact, authority, district, or service type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-950/80 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">Status: All</option>
                <option value="VERIFIED">Verified & Active</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="NEEDS_UPDATE">Needs Update</option>
                <option value="EXPIRED">Expired Review</option>
              </select>

              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">Scope: All</option>
                <option value="NATIONAL">National</option>
                <option value="STATE">State</option>
                <option value="DISTRICT">District</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">Authority: All</option>
                <option value="TIER_1_OFFICIAL_GOVERNMENT">Tier 1: Government</option>
                <option value="TIER_2_VETTED_NGO">Tier 2: Vetted NGO</option>
                <option value="TIER_3_COMMUNITY_VERIFIED">Tier 3: Community</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Showing <strong className="text-white">{filteredResources.length}</strong> of{" "}
              {resources.length} resources
            </span>
            <span className="text-[11px] text-slate-500">
              * Expired resources (review date in the past) are automatically suppressed from verified RAG.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Resource Table / Cards */}
      <div className="space-y-4">
        {filteredResources.map((res) => {
          const isExpired = new Date(res.nextReview) < new Date();
          return (
            <Card
              key={res.id}
              className={`bg-slate-900/90 border transition-all ${
                isExpired
                  ? "border-rose-900/60 bg-rose-950/10"
                  : res.verificationStatus === "VERIFIED"
                  ? "border-slate-800 hover:border-teal-500/40"
                  : "border-amber-900/40 bg-amber-950/10"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Core Identifiers */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{res.name}</h3>
                      <VerificationBadge
                        tier={res.authorityLevel}
                        status={res.verificationStatus}
                        nextReview={res.nextReview}
                      />
                      {isExpired && (
                        <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded">
                          EXPIRED (HIDDEN FROM SURVIVORS)
                        </span>
                      )}
                    </div>

                    {/* 8 Required Metadata Attributes Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      {/* 1. Service Type */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          1. Service Type
                        </span>
                        <span className="text-slate-200 font-medium mt-0.5 block truncate">
                          {res.serviceType.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* 2. Authority & Tier */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          2. Authority Level
                        </span>
                        <span className="text-teal-300 font-medium mt-0.5 block truncate">
                          {res.authorityLevel.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* 3. Geographic Scope */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          3. Geographic Scope
                        </span>
                        <span className="text-slate-200 font-medium mt-0.5 block truncate">
                          {res.geographicScope} {res.state ? `(${res.state})` : ""}
                        </span>
                      </div>

                      {/* 4. Verification Status */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          4. Status
                        </span>
                        <span
                          className={`font-semibold mt-0.5 block truncate ${
                            isExpired
                              ? "text-rose-400"
                              : res.verificationStatus === "VERIFIED"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          {isExpired ? "EXPIRED" : res.verificationStatus}
                        </span>
                      </div>

                      {/* 5. Last Verified Date */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          5. Last Verified
                        </span>
                        <span className="text-slate-200 font-mono mt-0.5 block">
                          {formatDate(res.lastVerified)}
                        </span>
                      </div>

                      {/* 6. Next Review Date */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          6. Next Review
                        </span>
                        <span
                          className={`font-mono mt-0.5 block ${
                            isExpired ? "text-rose-400 font-bold" : "text-slate-200"
                          }`}
                        >
                          {formatDate(res.nextReview)}
                        </span>
                      </div>

                      {/* 7. Source & Link */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          7. Source
                        </span>
                        <span className="text-slate-200 font-medium mt-0.5 block truncate">
                          {res.sourceOrganization || "Official Registry"}
                        </span>
                      </div>

                      {/* 8. Availability Where Known */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                          8. Availability
                        </span>
                        <span className="text-emerald-400 font-medium mt-0.5 block truncate">
                          {res.availability || (res.is24x7 ? "24/7 Active" : "Operational")}
                        </span>
                      </div>
                    </div>

                    {/* Contact & Hours Summary */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-white font-semibold">{res.contact}</span>
                        {res.secondaryContact && (
                          <span className="text-slate-500">/ {res.secondaryContact}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>Hours: {res.operatingHours}</span>
                      </div>
                      {res.sourceUrl && (
                        <a
                          href={res.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-teal-400 hover:text-teal-300 underline underline-offset-2"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
                    <Link href={`/admin/verification?id=${res.id}`}>
                      <Button
                        size="sm"
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                        Verify / Audit
                      </Button>
                    </Link>

                    {res.verificationStatus === "VERIFIED" && !isExpired ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateResource(res.id, {
                            verificationStatus: "NEEDS_UPDATE",
                          })
                        }
                        className="w-full border-amber-800/80 text-amber-300 hover:bg-amber-950/20 text-xs"
                      >
                        Flag Update
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateResource(res.id, {
                            verificationStatus: "VERIFIED",
                            nextReview: new Date(Date.now() + 86400000 * 90).toISOString(),
                          })
                        }
                        className="w-full border-emerald-800/80 text-emerald-300 hover:bg-emerald-950/20 text-xs"
                      >
                        Quick Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <Database className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No matching resources</h4>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your search terms or filters.</p>
          </div>
        )}
      </div>

      {/* Modal: Register Discovered Resource */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <DialogHeader>
          <DialogTitle>Register Discovered Resource</DialogTitle>
          <DialogDescription>
            Input raw source details to begin the 8-stage verification lifecycle.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Resource / Facility Name *
            </label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. One Stop Centre (Sakhi) - Safdarjung Hospital"
              className="bg-slate-900 border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value="ONE_STOP_CENTRE">One Stop Centre (Sakhi)</option>
                <option value="EMERGENCY_HELPLINE">Emergency Helpline</option>
                <option value="LEGAL_SERVICES_AUTHORITY">Legal Services Authority</option>
                <option value="TRAUMA_CENTRE">Trauma Centre / Hospital</option>
                <option value="SHELTER_HOME">Shelter Home</option>
                <option value="CYBER_CRIME_CELL">Cyber Crime Cell</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Authority Tier
              </label>
              <select
                value={authorityLevel}
                onChange={(e) => setAuthorityLevel(e.target.value as VerificationTier)}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value="TIER_1_OFFICIAL_GOVERNMENT">Tier 1: Official Government</option>
                <option value="TIER_2_VETTED_NGO">Tier 2: Vetted Legal/Medical NGO</option>
                <option value="TIER_3_COMMUNITY_VERIFIED">Tier 3: Community Verified</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Primary Contact Number *
              </label>
              <Input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. 112 or 011-26165060"
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Secondary Contact
              </label>
              <Input
                value={secondaryContact}
                onChange={(e) => setSecondaryContact(e.target.value)}
                placeholder="e.g. 011-26168000"
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Geographic Scope
              </label>
              <select
                value={geographicScope}
                onChange={(e) =>
                  setGeographicScope(e.target.value as "NATIONAL" | "STATE" | "DISTRICT")
                }
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value="NATIONAL">National</option>
                <option value="STATE">State</option>
                <option value="DISTRICT">District</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                State
              </label>
              <Input
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State"
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                District
              </label>
              <Input
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                placeholder="District"
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Source Organization
              </label>
              <Input
                value={sourceOrg}
                onChange={(e) => setSourceOrg(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Source Official URL
              </label>
              <Input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Operating Hours
              </label>
              <Input
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="24/7 or 9am - 6pm"
                className="bg-slate-900 border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                24x7 Operation
              </label>
              <select
                value={is24x7 ? "true" : "false"}
                onChange={(e) => setIs24x7(e.target.value === "true")}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value="true">Yes (24/7)</option>
                <option value="false">No (Specific Hours)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="NEEDS_UPDATE">Needs Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Availability Description
            </label>
            <Input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Operational 24/7 with on-duty caseworkers"
              className="bg-slate-900 border-slate-800 text-xs text-white"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-500 text-white font-semibold"
            >
              Save Discovered Resource
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
