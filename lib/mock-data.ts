import type { ApplicationPreview } from "./types";

export const applications: ApplicationPreview[] = [
  { id: "1", company: "Stripe", initials: "S", position: "Product Designer", status: "Applied", date: "Today", accent: "bg-violet-100 text-violet-700" },
  { id: "2", company: "Vercel", initials: "▲", position: "Frontend Engineer", status: "Applied", date: "Yesterday", accent: "bg-slate-900 text-white" },
  { id: "3", company: "Linear", initials: "L", position: "Software Engineer", status: "HR Screening", date: "Sep 12", accent: "bg-indigo-100 text-indigo-700" },
  { id: "4", company: "Notion", initials: "N", position: "Product Engineer", status: "Assessment", date: "Sep 10", accent: "bg-stone-100 text-stone-700" },
  { id: "5", company: "Shopify", initials: "S", position: "UX Engineer", status: "HR Interview", date: "Sep 08", accent: "bg-emerald-100 text-emerald-700" },
];

export const weekActivity = [
  { day: "Mon", done: true }, { day: "Tue", done: true }, { day: "Wed", done: true },
  { day: "Thu", done: true }, { day: "Fri", done: true }, { day: "Sat", done: true },
  { day: "Sun", done: false },
];
