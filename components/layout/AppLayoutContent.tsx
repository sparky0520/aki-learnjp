"use client";

import { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import AskAkiContext from "../../contexts/lesson/AkiContext";
import Image from "next/image";
import { LayoutProvider, useLayout } from "../../contexts/layout/LayoutContext";

export default function AppLayoutContent({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  return (
    <LayoutProvider>
      <MainLayout userId={userId}>{children}</MainLayout>
    </LayoutProvider>
  );
}

function MainLayout({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const pathname = usePathname();
  const { askAki } = useContext(AskAkiContext);
  const { sidebarVisible, setSidebarVisible } = useLayout();

  useEffect(() => {
    if (!userId) {
      window.location.href = "/sign-in";
    }
  }, [userId]);

  if (!userId) return null;

  const showSidebar = !pathname.includes("/course");

  return (
    <div className="flex bg-paper-bg text-[#343a40] h-screen overflow-hidden relative">
      {/* Blue halo ring */}
      {askAki && (
        <div className="absolute border-15 border-[#00c3ff] inset-0 rounded-lg blur-xl pointer-events-none animate-subtle-pulse z-50"></div>
      )}

      {/* Sidebar logic */}
      {showSidebar && (
        <>
          {/* Desktop Sidebar Logic */}
          <div className="hidden md:block h-full transition-all duration-300 ease-in-out">
            {sidebarVisible ? (
              <div className="border-r border-gray-400 w-64 min-w-64 h-full overflow-y-auto no-scrollbar">
                <div className="p-8 h-full">
                  <Sidebar setSidebarVisible={setSidebarVisible} />
                </div>
              </div>
            ) : (
              /* Desktop toggle when sidebar is closed (unmounted) */
              <div className="absolute top-8 left-8 z-40">
                <Image
                  src="/assets/arrow_menu_open.svg"
                  alt="Open sidebar"
                  width={24}
                  height={24}
                  className="opacity-90 cursor-pointer hover:opacity-100"
                  onClick={() => setSidebarVisible(true)}
                />
              </div>
            )}
          </div>

          {/* Mobile Sidebar Logic (Drawer) */}
          <div className="md:hidden">
            {/* Mobile Header / Toggle */}
            {!sidebarVisible && (
              <div className="absolute top-4 left-4 z-40">
                <Image
                  src="/assets/arrow_menu_open.svg"
                  alt="Open sidebar"
                  width={32}
                  height={32}
                  className="cursor-pointer opacity-80 hover:opacity-100"
                  onClick={() => setSidebarVisible(true)}
                />
              </div>
            )}

            {/* Mobile Overlay */}
            <div
              className={`
                fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out
                ${sidebarVisible ? "translate-x-0" : "-translate-x-full"}
            `}
            >
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setSidebarVisible(false)}
              ></div>
              <div className="relative bg-paper-bg w-4/5 max-w-xs h-full p-6 shadow-2xl overflow-y-auto">
                <Sidebar setSidebarVisible={setSidebarVisible} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto custom-scroll w-full relative">
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
