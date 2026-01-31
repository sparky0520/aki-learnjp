import Providers from "@/components/providers/Providers";
import AppLayoutContent from "@/components/layout/AppLayoutContent";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import AIGeneratedPageModal from "@/components/ui/AIGeneratedPageModal";
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aki - Japanese Learning Dashboard",
  description: "Application dashboard.",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <Providers>
            <AppLayoutContent userId={userId}>{children}</AppLayoutContent>
            <AIGeneratedPageModal />
          </Providers>
        </ClerkProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
