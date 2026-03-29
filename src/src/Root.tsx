import { Composition } from "remotion";
import { ExcellisVideo } from "./ExcellisVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ExcellisVideo"
        component={ExcellisVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
