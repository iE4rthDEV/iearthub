import { Braces, CircleDollarSign, Lock, QrCode } from "lucide-react";

import type { Tool } from "@/types/tool";

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
