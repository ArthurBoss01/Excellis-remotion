import { Composition } from "remotion";
import { ExcellisVideo } from "../ExcellisVideo";
import { CelineDionTikTok } from "../CelineDionTikTok";
import { RolandGarrosTikTok } from "../RolandGarrosTikTok";
import { WorldCupTikTok } from "../WorldCupTikTok";
import { CelineDionPoster } from "../CelineDionPoster";

export const RemotionRoot = () => (
  <>
    <Composition
      id="ExcellisVideo"
      component={ExcellisVideo}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="CelineDionTikTok"
      component={CelineDionTikTok}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="RolandGarrosTikTok"
      component={RolandGarrosTikTok}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="WorldCupTikTok"
      component={WorldCupTikTok}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="CelineDionPoster"
      component={CelineDionPoster}
      durationInFrames={1}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
