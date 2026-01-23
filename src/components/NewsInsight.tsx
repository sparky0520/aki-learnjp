import React from "react";

function NewsInsight({ sourceCode, description, link }: { sourceCode: React.ReactNode, description: string, link: string }) {
  return (
    <a href={link} target="_blank" className="w-max">
      {sourceCode}
      <div className="mt-3 hover:text-blue-400">{description}</div>
    </a>
  );
}

export default NewsInsight;
