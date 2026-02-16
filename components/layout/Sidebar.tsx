"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useLastAccessed } from "../../contexts/lesson/LastAccessedContext";
import { useAuth } from "../../contexts/auth/AuthContext";
import FeedbackForm from "../feedback/FeedbackForm";

// Constants

function Sidebar({
  setSidebarVisible,
}: {
  setSidebarVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(null);
  const { lastAccessed } = useLastAccessed();
  const { currentUser } = useAuth();

  // Default to lesson 1 if not loaded yet
  const lessonNumber = lastAccessed?.lessonNumber || 1;

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser?.id) return;

      try {
        const res = await fetch(
          `/api/progress/${currentUser.id}/lesson/${lessonNumber}`,
        );
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [currentUser, lessonNumber]);

  return (
    <div className="flex flex-col justify-between h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          {/* Aki logo */}
          <Link href="/dashboard" className="p-4 pl-0 select-none">
            <Image src="/aki_logo.png" alt="Logo" width={100} height={50} />
          </Link>
          {/* Close sidebar icon */}
          <Image
            src="/assets/arrow_menu_close.svg"
            alt="Close sidebar"
            width={24}
            height={24}
            className="opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => {
              setSidebarVisible((prev: boolean) => !prev);
            }}
          />
        </div>
        <Link
          href={`/course/${lastAccessed?.courseNumber || 1}`}
          className={`${pathname.includes("/course")
            ? "underline decoration-gray-400 decoration-1 underline-offset-8"
            : "no-underline"
            }`}
        >
          Course Chart
        </Link>
        <Link
          href={`/lesson/${lessonNumber}`}
          className={`btn py-2 ${pathname === `/lesson/${lessonNumber}`
            ? "underline decoration-gray-400 decoration-1 underline-offset-8"
            : "no-underline"
            }`}
        >
          About Lesson
        </Link>
        <div className="flex flex-col gap-2">
          <div className="font-extrabold text-xl">Reading</div>
          <div className="flex flex-col gap-2">
            {[
              { path: "goi", label: "Goi" },
              { path: "bunkei", label: "Bunkei" },
              { path: "reibun", label: "Reibun" },
              { path: "renshuua", label: "Renshuu A" },
            ].map((link) => (
              <Link
                key={link.path}
                href={`/lesson/${lessonNumber}/${link.path}`}
                className={`${pathname.includes(`/${link.path}`)
                  ? "underline decoration-gray-400 decoration-1 underline-offset-8"
                  : "no-underline"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-extrabold text-xl">Exercise</div>
          <div className="flex flex-col gap-2">
            {[
              {
                id: "renshuub",
                label: "Renshuu B",
                key: "renshuu_b_completed",
              },
              {
                id: "renshuuc",
                label: "Renshuu C",
                key: "renshuu_c_completed",
              },
              { id: "mondai", label: "Mondai", key: "mondai_completed" },
              { id: "kaiwa", label: "Kaiwa", key: "kaiwa_completed" },
            ].map((item) => (
              <Link
                key={item.id}
                href={`/lesson/${lessonNumber}/${item.id}`}
                className="flex gap-2 items-center group"
              >
                {progress?.[item.key] ? (
                  <Image
                    src={"/assets/check.svg"}
                    alt="Check"
                    width={20}
                    height={20}
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                ) : null}
                <div
                  className={`${pathname.includes(`/${item.id}`)
                    ? "underline decoration-gray-400 decoration-1 underline-offset-8"
                    : "no-underline"
                    }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
        <FeedbackForm />
        <div className="flex items-center gap-3 mt-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {currentUser?.name || "User"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
