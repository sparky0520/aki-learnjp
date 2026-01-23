import Link from "next/link";

function Shuuryou({ lessonNo }: { lessonNo: number }) {
  return (
    <Link
      className="text-lg font-extrabold opacity-90"
      href={"/lesson/" + lessonNo}
    >
      {"<"} 終了
    </Link>
  );
}

export default Shuuryou;
