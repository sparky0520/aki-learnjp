import Providers from "@/components/Providers";
import AppLayoutContent from "@/components/AppLayoutContent";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import AIGeneratedPageModal from "@/components/AIGeneratedPageModal";
import "../globals.css";

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
      </body>
    </html>
  );
}
