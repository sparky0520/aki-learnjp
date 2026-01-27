"use client";

import { useState, useContext } from "react";
import Sidebar from "./Sidebar"; // Ensure component exists or update import
import { usePathname } from "next/navigation";
import AskAkiContext from "../contexts/AkiContext";
import arrowMenuOpen from "@/public/assets/arrow_menu_open.svg"; // Update asset path
import AIGeneratedPageModal from "./AIGeneratedPageModal";
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

  // currentUser prop for Sidebar?
  // In App.jsx, currentUser was fetched via useAuthSync.
  // Here we have userId from server, but Sidebar might need full user object.
  // Sidebar likely fetches user or takes it as prop.
  // For now, I'll pass userId.

  const showSidebar = !pathname.includes("/course");

  return (
    <div className="flex bg-[#fffce8] text-[#343a40] h-screen">
      {askAki && (
        <div className="absolute border-15 border-[#00c3ff] inset-0 rounded-lg blur-xl pointer-events-none animate-subtle-pulse"></div>
      )}

      {showSidebar &&
        (sidebarVisible ? (
          <div className="p-8 border-r border-gray-400 w-1/5 max-w-64 overflow-y-auto no-scrollbar">
            <Sidebar setSidebarVisible={setSidebarVisible} />
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-start">
            {/* arrowMenuOpen was imported as string in Vite, need check in Next */}
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

      <div className="p-8 pb-0 mb-4 w-full overflow-y-auto custom-scroll">
        {children}
      </div>
      <AIGeneratedPageModal />
    </div>
  );
}
