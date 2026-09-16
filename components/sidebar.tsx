"use client";

import { BarChart3, Building2, LayoutDashboard, PanelLeftClose, Plus, Settings, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useStore } from "@/lib/store";

const items = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Applications", icon: PanelLeftClose, href: "/applications" },
  { label: "Companies", icon: Building2, href: "/companies" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { applications, profile, user, logout } = useStore();
  const name=profile?.full_name||user?.user_metadata?.full_name||user?.email?.split("@")[0]||"User";
  const initials=name.split(" ").map((x:string)=>x[0]).join("").slice(0,2).toUpperCase();
  return (
    <>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-navy/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-navy text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between px-6">
          <a href="/dashboard" className="flex items-center gap-3" aria-label="JobTrackr home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal font-bold shadow-lg shadow-teal/20">J</span>
            <span className="text-xl font-bold tracking-tight">JobTrackr</span>
          </a>
          <button className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden" onClick={onClose}><X size={20} /></button>
        </div>

        <nav className="mt-4 flex-1 px-4" aria-label="Main navigation">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/35">Workspace</p>
          <div className="space-y-1">
            {items.map(({ label, icon: Icon, href }) => {
              const active = pathname === href;
              return (
              <a key={label} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />{label}
                {label === "My Applications" && <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px]">{applications.length}</span>}
              </a>
            )})}
          </div>
          <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/35">Support</p>
          {[{ label: "Settings", icon: Settings, href: "/settings" }].map(({ label, icon: Icon, href }) => (
            <a key={label} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${pathname === href ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}><Icon size={19} strokeWidth={1.8} />{label}</a>
          ))}
        </nav>

        <div className="p-4">
          <button onClick={() => router.push("/applications?new=1")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-teal-600">
            <Plus size={18} /> Add New Application
          </button>
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 px-2 pt-5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-teal to-cyan-600 text-xs font-bold">{initials}</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{name}</p><p className="truncate text-xs text-white/40">{user?.email}</p></div>
            <button onClick={logout} title="Logout" className="ml-auto rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"><LogOut size={16}/></button>
          </div>
        </div>
      </aside>
    </>
  );
}
