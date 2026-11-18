import { asset } from "@/lib/asset";
import { CSSProperties } from "react";

// Looping, muted, autoplaying background video used for the hero / section-two
// full-bleed backgrounds and the animated collage tiles. Serves webm first, mp4
// fallback. (These were animated GIFs in the Figma — converted to video for weight.)
export function VideoBg({
  name,
  style,
  poster,
}: {
  name: string;
  style?: CSSProperties;
  poster?: string;
}) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      style={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <source src={asset(`/assets/${name}.webm`)} type="video/webm" />
      <source src={asset(`/assets/${name}.mp4`)} type="video/mp4" />
    </video>
  );
}
