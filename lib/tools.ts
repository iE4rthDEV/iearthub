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
  isNew?: boolean;
  usage?: { count: string; rating: string };
};

export const tools: Tool[] = [
  {
    id: "sum",
    name: "สรุปข้อความ",
    description: "วางบทความยาว แล้วได้ใจความสำคัญภายในไม่กี่วินาที",
    category: "text",
    icon: FileText,
    isNew: true,
    usage: { count: "1.2k", rating: "4.9" },
  },
  {
    id: "lang",
    name: "แปลงภาษา",
    description: "ไทย ⇄ อังกฤษ และแก้คีย์บอร์ดพิมพ์ผิดภาษา",
    category: "text",
    icon: Languages,
  },
  {
    id: "img",
    name: "ย่อขนาดรูป",
    description: "บีบอัดรูปก่อนอัปโหลด",
    category: "img",
    icon: Image,
  },
  {
    id: "bg",
    name: "ลบพื้นหลัง",
    description: "ตัดพื้นหลังรูปอัตโนมัติ",
    category: "img",
    icon: Scissors,
    isNew: true,
  },
  {
    id: "json",
    name: "JSON Formatter",
    description: "จัดรูปแบบและตรวจ JSON",
    category: "dev",
    icon: Braces,
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
    id: "days",
    name: "นับวันทำงาน",
    description: "คำนวณวันทำงานไม่รวมวันหยุดไทย",
    category: "daily",
    icon: CalendarDays,
  },
  {
    id: "fx",
    name: "แปลงสกุลเงิน",
    description: "อัตราแลกเปลี่ยนล่าสุด",
    category: "daily",
    icon: CircleDollarSign,
  },
];
