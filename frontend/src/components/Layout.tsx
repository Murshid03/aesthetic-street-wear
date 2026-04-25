import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
