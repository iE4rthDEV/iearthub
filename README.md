# iEartHub

หน้าเว็บรวมเครื่องมือส่วนตัว ใช้ Next.js App Router, TypeScript, Tailwind CSS 4, shadcn/ui, daisyUI 5 และ CodeMirror 6 (ตัวแก้ไข JSON)

## เปิดโปรเจกต์

```bash
npm ci
npm run dev
```

เปิด [localhost:3000](http://localhost:3000)

- ค้นหาจากชื่อหรือคำอธิบายและกรองตามหมวดหมู่ กด `/` เพื่อไปที่ช่องค้นหา
- กดดาวเพื่อปักหมุดในส่วน **ใช้บ่อย** รายการปักหมุดจะเก็บไว้ในเบราว์เซอร์
- เว็บใช้ธีมสว่าง (light) อย่างเดียว
- ตอนนี้เปิดใช้งานได้แล้ว: **JSON Formatter** (จัดรูป ย่อ ซ่อม JSON ดูแบบ Text/Tree) เครื่องมืออื่นยังขึ้นว่า "เร็วๆ นี้"

โค้ดทั้งหมดอยู่ใน `src/` ข้อมูลเครื่องมืออยู่ใน `src/data/tools.ts` และสีของเว็บอยู่ใน `src/app/globals.css` โดยใช้ shadcn/ui สำหรับปุ่มและช่องค้นหา ส่วน daisyUI ใช้กับป้ายคีย์ลัดและ footer

```bash
npm run lint
npm run build
```
