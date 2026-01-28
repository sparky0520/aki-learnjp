import Image from "../../ui/Image";
import KaiwaTextSnippet from "./KaiwaTextSnippet";
import PlaybackBar from "../shared/PlaybackBar";

interface KaiwaData {
  img?: string;
  heading?: string;
  text?: string[];
  audio?: string;
}

function ReadingListeningSpeakingKaiwa({ data }: { data: KaiwaData }) {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-8 items-center w-full max-w-5xl">
        {/* Question */}
        <div className="w-1/2 flex justify-center">
          {data.img && (
            <Image
              src={data.img}
              className="max-w-full pointer-events-none"
              alt=""
            />
          )}
        </div>
        <div className="w-1/2">
          {/* Heading */}
          <div
            className="text-center text-lg font-bold mb-2"
            dangerouslySetInnerHTML={{ __html: data.heading || "" }}
          ></div>
          {/* Kaiwa text */}
          <div className="flex flex-col gap-8 max-h-80 pr-4 overflow-y-auto custom-scroll">
            {/* Text snippet 1 */}
            {data.text &&
              data.text.map((e, i) => (
                <KaiwaTextSnippet active={true} text={e} key={i} />
              ))}
          </div>
        </div>
      </div>
      {/* <PlaybackBar audio={data.audio || ""} /> */}
    </div>
  );
}

export default ReadingListeningSpeakingKaiwa;
