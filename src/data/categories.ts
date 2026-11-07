import { CalendarDays, CodeXml, Image, LayoutGrid, TextAlignStart } from "lucide-react";

export const categories = [
  { id: "all", label: "ทั้งหมด", icon: LayoutGrid },
  { id: "text", label: "ข้อความ", icon: TextAlignStart },
  { id: "img", label: "รูปภาพ", icon: Image },
  { id: "dev", label: "นักพัฒนา", icon: CodeXml },
  { id: "daily", label: "ใช้ทุกวัน", icon: CalendarDays },
] as const;

export type Category = (typeof categories)[number]["id"];
