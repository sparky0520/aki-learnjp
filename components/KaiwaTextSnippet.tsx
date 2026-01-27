import React from "react";
import Image from "next/image";

const volumeUpIcon = "/assets/volume_up.svg";

function KaiwaTextSnippet({ active, text }: { active: boolean; text: string }) {
  const ele = text.split(":");
  const speaker = ele[0] + ":";
  const dialogue = ele[1];
  return (
    <button className={`flex gap-2 items-start ${active ? "" : "opacity-50"}`}>
      <Image
        src={volumeUpIcon}
        alt="Speaker"
        width={20}
        height={20}
        className="opacity-70 mt-1"
      />
      <div className="flex gap-4 text-start text-lg">
        <div
          className="text-nowrap font-bold"
          dangerouslySetInnerHTML={{ __html: speaker }}
        ></div>
        <div dangerouslySetInnerHTML={{ __html: dialogue }} />
      </div>
    </button>
  );
}

export default KaiwaTextSnippet;
