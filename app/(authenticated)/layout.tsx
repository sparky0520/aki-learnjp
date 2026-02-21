import Providers from "@/components/providers/Providers";
import AppLayoutContent from "@/components/layout/AppLayoutContent";
import { auth } from "@clerk/nextjs/server";
import { ClerkProvider, OrganizationSwitcher } from "@clerk/nextjs";
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
            {/* <div className="absolute top-4 right-4 z-50">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/select-organization"
              />
            </div> */}
            <AppLayoutContent userId={userId}>{children}</AppLayoutContent>
          </Providers>
        </ClerkProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
