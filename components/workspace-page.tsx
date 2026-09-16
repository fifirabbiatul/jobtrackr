"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Bell, Loader2, Menu, Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export function WorkspacePage({ title, eyebrow, action, children }: { title: string; eyebrow: string; action?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query,setQuery]=useState(""); const [notice,setNotice]=useState(false); const [lastSeenNotification,setLastSeenNotification]=useState(""); const notificationRef=useRef<HTMLDivElement>(null); const {loading,user,applications,companies,logs}=useStore(); const router=useRouter();
  useEffect(()=>{if(!loading&&!user)router.replace("/")},[loading,user,router]);
  useEffect(()=>{if(!user)return;setLastSeenNotification(localStorage.getItem(`jobtrackr-notifications-seen:${user.id}`)||"")},[user]);
  useEffect(()=>{if(!notice)return;const close=(event:MouseEvent)=>{if(!notificationRef.current?.contains(event.target as Node))setNotice(false)};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[notice]);
  if(loading||!user)return <div className="grid min-h-screen place-items-center bg-slate-50"><Loader2 className="animate-spin text-teal"/></div>;
  const userId=user.id;
  const results=query? [...applications.filter(a=>`${a.position_title} ${a.companies?.name}`.toLowerCase().includes(query.toLowerCase())).map(a=>({label:a.position_title,sub:a.companies?.name||"Application",href:"/applications"})),...companies.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())).map(c=>({label:c.name,sub:c.industry||"Company",href:"/companies"}))].slice(0,6):[];
  const hasUnread=logs.some(log=>!lastSeenNotification||log.created_at>lastSeenNotification);
  function toggleNotifications(){const next=!notice;setNotice(next);if(next&&logs[0]){const seenAt=logs[0].created_at;setLastSeenNotification(seenAt);localStorage.setItem(`jobtrackr-notifications-seen:${userId}`,seenAt)}}
  return <div className="min-h-screen bg-[#F7F9FC]"><Sidebar open={open} onClose={() => setOpen(false)} /><main className="lg:pl-[264px]">
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-8 lg:px-10">
      <button onClick={() => setOpen(true)} className="rounded-xl border border-slate-200 p-2.5 lg:hidden" aria-label="Open navigation"><Menu size={20} /></button>
      <div className="ml-auto flex items-center gap-2"><label className="relative hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-400 md:flex"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-44 bg-transparent text-sm outline-none" placeholder="Search…"/>{query&&<div className="absolute right-0 top-12 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">{results.length?results.map((r,i)=><a key={i} href={r.href} className="block px-4 py-3 hover:bg-slate-50"><span className="block text-xs font-semibold text-navy">{r.label}</span><span className="text-[10px] text-slate-400">{r.sub}</span></a>):<p className="p-4 text-xs">No results</p>}</div>}</label><div ref={notificationRef} className="relative"><button onClick={toggleNotifications} className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500" aria-label="Notifications"><Bell size={18}/>{hasUnread&&<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"/>}</button>{notice&&<div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"><h3 className="text-sm font-bold text-navy">Recent notifications</h3>{logs.slice(0,5).map(l=><div key={l.id} className="mt-3 border-t border-slate-100 pt-3"><p className="text-xs font-semibold text-slate-700">{l.notes||l.status_stage}</p><p className="text-[10px] text-slate-400">{new Date(l.created_at).toLocaleString()}</p></div>)}{!logs.length&&<p className="mt-3 text-xs text-slate-400">No notifications yet.</p>}</div>}</div></div>
    </header>
    <div className="mx-auto max-w-[1500px] p-5 md:p-8 lg:p-10"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold tracking-tight text-navy md:text-3xl">{title}</h2><p className="mt-1 text-sm text-slate-500">{eyebrow}</p></div>{action}</div>{children}</div>
  </main></div>;
}
