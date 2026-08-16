import { Navbar } from "@/shared/components/composite/navbar";
import { Footer } from "@/shared/components/composite/footer";
import { AiChatWidget } from "@/features/ai/components/ai-chat-widget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
