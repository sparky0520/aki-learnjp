import Providers from "@/components/providers/Providers";
import AppLayoutContent from "@/components/layout/AppLayoutContent";
import { auth } from "@clerk/nextjs/server";
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
    <Providers>
      <AppLayoutContent userId={userId}>{children}</AppLayoutContent>
    </Providers>
  );
}
