export type ApplicationStatus =
  | "Wishlist" | "Applied" | "HR Screening" | "Assessment" | "HR Interview"
  | "User Interview" | "Final Interview" | "Offering" | "Hired" | "Rejected" | "Ghosted";

export interface ApplicationPreview {
  id: string;
  company: string;
  initials: string;
  position: string;
  status: ApplicationStatus;
  date: string;
  accent: string;
}
