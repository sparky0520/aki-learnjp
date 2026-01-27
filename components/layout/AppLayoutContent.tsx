"use client";

import { useState, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import AskAkiContext from "../../contexts/lesson/AkiContext";
import AIGeneratedPageModal from "../ui/AIGeneratedPageModal";
import Image from "next/image";

export default function AppLayoutContent({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const pathname = usePathname();
  const { askAki } = useContext(AskAkiContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (!userId) {
      window.location.href = "/sign-in";
    }
  }, [userId]);

  if (!userId) return null;

  const showSidebar = !pathname.includes("/course");

  return (
    <div className="flex bg-paper-bg text-[#343a40] h-screen">
      {/* Blue halo ring */}
      {askAki && (
        <div className="absolute border-15 border-[#00c3ff] inset-0 rounded-lg blur-xl pointer-events-none animate-subtle-pulse"></div>
      )}

      {/* Sidebar toggle */}
      {showSidebar &&
        (sidebarVisible ? (
          <div className="p-8 border-r border-gray-400 w-1/5 max-w-64 overflow-y-auto no-scrollbar">
            <Sidebar setSidebarVisible={setSidebarVisible} />
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-start">
            <Image
              src="/assets/arrow_menu_open.svg"
              alt="Open sidebar"
              width={24}
              height={24}
              className="opacity-90 ml-4 cursor-pointer"
              onClick={() => {
                setSidebarVisible((prev) => !prev);
              }}
            />
          </div>
        ))}

      <div className="relative p-8 w-full flex flex-col h-full overflow-y-auto custom-scroll">
        {children}
      </div>
      <AIGeneratedPageModal />
    </div>
  );
}
