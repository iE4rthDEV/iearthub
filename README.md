# iEartHub

หน้าเว็บรวมเครื่องมือจาก prototype ใช้ Next.js App Router, TypeScript, Tailwind CSS 4, shadcn/ui และ daisyUI 5

## เปิดโปรเจกต์

```bash
npm ci
npm run dev
```

เปิด [localhost:3000](http://localhost:3000)

- ค้นหาจากชื่อหรือคำอธิบายและกรองตามหมวดหมู่ กด `/` เพื่อไปที่ช่องค้นหา
- กดดาวเพื่อปักหมุดในส่วน **ใช้บ่อย** ธีมและรายการปักหมุดจะเก็บไว้ในเบราว์เซอร์
- ปุ่มเปิดเครื่องมือเป็นส่วนของต้นแบบ จึงปิดการกดไว้

ข้อมูลเครื่องมืออยู่ใน `lib/tools.ts` และสีของทั้งสองธีมอยู่ใน `app/globals.css` โดยใช้ shadcn/ui สำหรับปุ่มและช่องค้นหา ส่วน daisyUI ใช้กับป้ายคีย์ลัดและ footer

```bash
npm run lint
npm run build
```
