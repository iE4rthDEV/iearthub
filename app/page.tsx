import { Footer } from "@/components/footer";
import { ToolHub } from "@/components/tool-hub";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <ToolHub />
      <Footer />
    </div>
  );
}
