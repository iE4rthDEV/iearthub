import type { LucideIcon } from "lucide-react";

import type { Category } from "@/data/categories";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  icon: LucideIcon;
  /** Page path of a tool that is ready to use. Tools without it show as "coming soon". */
  href?: string;
  isNew?: boolean;
  usage?: { count: string; rating: string };
};
