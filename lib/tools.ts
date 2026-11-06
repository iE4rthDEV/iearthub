import {
  Braces,
  CalendarDays,
  CircleDollarSign,
  CodeXml,
  FileText,
  Image,
  Languages,
  LayoutGrid,
  Lock,
  QrCode,
  Scissors,
  TextAlignStart,
  type LucideIcon,
} from "lucide-react";

export const categories = [
  { id: "all", label: "ทั้งหมด", icon: LayoutGrid },
  { id: "text", label: "ข้อความ", icon: TextAlignStart },
  { id: "img", label: "รูปภาพ", icon: Image },
  { id: "dev", label: "นักพัฒนา", icon: CodeXml },
  { id: "daily", label: "ใช้ทุกวัน", icon: CalendarDays },
] as const;

export type Category = (typeof categories)[number]["id"];

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

export const tools: Tool[] = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "จัดรูปแบบและตรวจ JSON",
    category: "dev",
    icon: Braces,
    isNew: true,
    href: "/tools/json",
  },
  {
    id: "pw",
    name: "สร้างรหัสผ่าน",
    description: "สุ่มรหัสผ่านที่ปลอดภัย",
    category: "dev",
    icon: Lock,
  },
  {
    id: "qr",
    name: "สร้าง QR Code",
    description: "ลิงก์, Wi-Fi, PromptPay",
    category: "daily",
    icon: QrCode,
  },
  {
    id: "fx",
    name: "แปลงสกุลเงิน",
    description: "อัตราแลกเปลี่ยนล่าสุด",
    category: "daily",
    icon: CircleDollarSign,
  },
];
