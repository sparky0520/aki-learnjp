"use client";

import React from "react";
import Image from "next/image";

function KaiwaTextSnippet({ active, text }: { active: boolean, text: string }) {
  const ele = text.split(":");
  const speaker = ele[0] + ":";
  const dialogue = ele[1];
  return (
    <button className={`flex gap-2 items-start ${active ? "" : "opacity-50"}`}>
      <Image 
        src="/assets/volume_up.svg" 
        alt="speak" 
        width={24} 
        height={24} 
        className="opacity-70 mt-1" 
      />
      <div className="flex gap-4 text-start text-lg">
        <div className="text-nowrap">{speaker}</div>
        <div dangerouslySetInnerHTML={{ __html: dialogue }} />
      </div>
    </button>
  );
}

export default KaiwaTextSnippet;
