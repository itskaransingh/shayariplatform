import { Footer, Header, Sidebar } from "@/components";
import "@/styles/globals.css";
import { GlobalProvider } from "@/contexts";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalProvider>
      <Header />
      <div className="container  xl:px-0 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Sidebar />
        <main className="flex   min-h-screen flex-col items-center justify-between py-10">
          {children}
        </main>
      </div>
      <Footer />
    </GlobalProvider>
  );
}
