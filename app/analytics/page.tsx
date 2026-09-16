"use client";

import { WorkspacePage } from "@/components/workspace-page";
import { useStore } from "@/lib/store";

const funnelStages = ["Applied", "HR Screening", "Assessment", "HR Interview", "User Interview", "Final Interview", "Offering"];
const activeStatuses = new Set(funnelStages);

export default function Page() {
  const { applications } = useStore();
  const submitted = applications.filter((application) => application.current_status !== "Wishlist");
  const total = submitted.length;
  const active = submitted.filter((application) => activeStatuses.has(application.current_status)).length;
  const hired = submitted.filter((application) => application.current_status === "Hired").length;
  const rejected = submitted.filter((application) => application.current_status === "Rejected").length;
  const ghosted = submitted.filter((application) => application.current_status === "Ghosted").length;
  const sources = [...new Set(submitted.map((application) => application.source || "Unknown"))];

  return <WorkspacePage title="Analytics & Insights" eyebrow="Insight dihitung dari data lamaranmu">
    <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Metric label="Total Applications" value={total} tone="navy" />
      <Metric label="Active" value={active} tone="teal" />
      <Metric label="Hired" value={hired} tone="green" />
      <Metric label="Rejected" value={rejected} tone="rose" />
      <Metric label="Ghosted" value={ghosted} tone="slate" />
    </section>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border bg-white p-6 shadow-card"><h3 className="font-bold text-navy">Hiring Funnel</h3><p className="mt-1 text-xs text-slate-400">Current position of active applications</p>{!total?<Empty/>:<div className="mt-6 space-y-3">{funnelStages.map(stage=>{const count=submitted.filter(application=>application.current_status===stage).length;return <div key={stage}><div className="flex justify-between text-xs"><span>{stage}</span><b>{count}</b></div><div className="mt-1 h-7 rounded bg-slate-100"><div className="h-full rounded bg-gradient-to-r from-navy to-teal" style={{width:`${Math.max(count/total*100,count?8:0)}%`}}/></div></div>})}</div>}</section>
      <section className="rounded-2xl border bg-white p-6 shadow-card"><h3 className="font-bold text-navy">Application Sources</h3><p className="mt-1 text-xs text-slate-400">Where submitted applications came from</p>{!total?<Empty/>:<div className="mt-6 space-y-5">{sources.map(source=>{const count=submitted.filter(application=>(application.source||"Unknown")===source).length;return <div key={source}><div className="flex justify-between text-sm"><span>{source}</span><b>{Math.round(count/total*100)}%</b></div><div className="mt-2 h-2 rounded bg-slate-100"><div className="h-full rounded bg-teal" style={{width:`${count/total*100}%`}}/></div><p className="mt-1 text-[10px] text-slate-400">{count} application{count===1?"":"s"}</p></div>})}</div>}</section>
    </div>
  </WorkspacePage>;
}

function Metric({label,value,tone}:{label:string;value:number;tone:"navy"|"teal"|"green"|"rose"|"slate"}){const tones={navy:"bg-navy text-white",teal:"bg-teal-50 text-teal-700",green:"bg-emerald-50 text-emerald-700",rose:"bg-rose-50 text-rose-700",slate:"bg-slate-100 text-slate-700"};return <div className={`rounded-2xl p-5 ${tones[tone]}`}><p className="text-xs font-semibold opacity-70">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>}
function Empty(){return <p className="mt-8 text-center text-sm text-slate-400">Add applications to see analytics.</p>}
