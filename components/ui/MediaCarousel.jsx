"use client";

import { useState, useEffect, useRef } from "react";
import RemoteImage from "@/components/ui/RemoteImage";
import { isVideoMedia } from "@/lib/category-utils";

function CarouselSlide({ src, alt, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const play = () => video.play().catch(() => {});
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        play();
      } else {
        video.addEventListener("canplay", play, { once: true });
        return () => video.removeEventListener("canplay", play);
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive, src]);

  return (
    <div className="relative h-full w-full">
      {isVideoMedia(src) ? (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          autoPlay={isActive}
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <RemoteImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={isActive}
        />
      )}
    </div>
  );
}

export default function MediaCarousel({ media = [], alt = "", interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = media.length > 1;
  const activeSrc = media[index];
  const slideInterval = isVideoMedia(activeSrc) ? Math.max(interval, 10000) : interval;

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, slideInterval);
    return () => clearInterval(id);
  }, [hasMultiple, media.length, slideInterval]);

  if (!media?.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {media.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${(i - index) * 100}%)` }}
          aria-hidden={i !== index}
        >
          <CarouselSlide src={src} alt={alt} isActive={i === index} />
        </div>
      ))}

      {hasMultiple && (
        <>
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-2">
            {media.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIndex((index - 1 + media.length) % media.length)}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((index + 1) % media.length)}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
