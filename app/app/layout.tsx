import Providers from "../../components/Providers";
import AppLayoutContent from "../../components/AppLayoutContent";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AIGeneratedPageModal from "../../components/AIGeneratedPageModal"; // Verify if this component exists/copied

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in"); // Or sign-in
  }

  // TODO: currentUser sync logic if needed server-side, typically handled by middleware or verify endpoint.

  return (
    <Providers>
      <AppLayoutContent userId={userId}>
        {children}
      </AppLayoutContent>
      <AIGeneratedPageModal />
    </Providers>
  );
}
