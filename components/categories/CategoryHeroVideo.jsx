"use client";

import { useEffect, useRef } from "react";
import { isVideoMedia } from "@/lib/category-utils";

export default function CategoryHeroVideo({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => video.play().catch(() => {});
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      play();
    } else {
      video.addEventListener("canplay", play, { once: true });
      return () => video.removeEventListener("canplay", play);
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
