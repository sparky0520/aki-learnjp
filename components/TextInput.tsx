import React, { useEffect, useState } from "react";

function TextInput({
  partNo,
  handleTextChange,
}: {
  partNo: number;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput("");
  }, [partNo]);

  return (
    <div className="flex gap-2 mt-4 items-end text-lg font-extrabold opacity-90">
      <input
        maxLength={1000}
        type="text"
        value={input}
        className="border-b border-dashed w-[600px] text-2xl font-extrabold opacity-90 p-2 focus:outline-none custom-scroll bg-transparent"
        onChange={(e) => {
          setInput(e.target.value);
          handleTextChange(e);
        }}
      />
    </div>
  );
}

export default TextInput;
