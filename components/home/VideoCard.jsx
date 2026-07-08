"use client";

import Image from "next/image";
import { Video, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { getYoutubeEmbedUrl, YOUTUBE_CHANNEL } from "@/lib/youtube";

function VideoCard({ video }) {
  const embedUrl = getYoutubeEmbedUrl(video.video_url);

  // No parsable video URL yet — fallback card, styled like the category cards below.
  if (!embedUrl) {
    return (
      <a
        href={video.video_url || YOUTUBE_CHANNEL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-slate-200"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-colors flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <Play className="h-8 w-8 text-sky-600 fill-sky-600" />
          </div>
          <p className="text-white font-display font-semibold text-lg mb-1 drop-shadow-sm">
            {video.title || "Watch on YouTube"}
          </p>
          {video.caption && (
            <p className="text-white/80 text-sm line-clamp-2">{video.caption}</p>
          )}
          <span className="inline-flex items-center gap-1 text-sky-300 text-xs mt-3 font-medium">
            <Video className="h-3.5 w-3.5" />
            @ommosquitonets
          </span>
        </div>
      </a>
    );
  }

  // Valid video URL — embed directly via iframe.
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-slate-200">
      <div className="relative aspect-video">
        <iframe
          src={embedUrl}
          title={video.title || "YouTube video"}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {(video.title || video.caption) && (
        <div className="p-4">
          {video.title && (
            <p className="font-display font-semibold text-base text-slate-900 mb-0.5">
              {video.title}
            </p>
          )}
          {video.caption && (
            <p className="text-slate-500 text-xs line-clamp-1">{video.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function YoutubeGallery({ videos }) {
  if (!videos?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-50 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 text-sm font-medium mb-4 border border-sky-100">
              <Video className="h-4 w-4" />
              @ommosquitonets
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Installation Videos
            </h2>
            <p className="text-slate-500 max-w-xl leading-relaxed">
              See our mosquito net installations in action. Subscribe on YouTube for
              the latest projects across Chennai.
            </p>
          </div>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full border-sky-200 text-sky-600 hover:bg-sky-50 shrink-0">
              <Video className="h-4 w-4" />
              Subscribe on YouTube
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {videos.slice(0, 6).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}