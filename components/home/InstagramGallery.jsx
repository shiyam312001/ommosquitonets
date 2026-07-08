import Link from "next/link";
import Image from "next/image";
import { Share2, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { getInstagramEmbedUrl, INSTAGRAM_PROFILE } from "@/lib/instagram";

function VideoCard({ video }) {
  const embedUrl = getInstagramEmbedUrl(video.reel_url);
  const isProfileLink = !embedUrl;
  const thumbnailSrc = video.thumbnail_url || null;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-slate-200">
      {embedUrl ? (
        <div className="relative aspect-[9/16] max-h-[420px]">
          <iframe
            src={embedUrl}
            title={video.title || "Instagram video"}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : (
        <a
          href={video.reel_url || INSTAGRAM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[9/16] max-h-[420px]"
        >
          {thumbnailSrc ? (
            <>
              <Image
                src={thumbnailSrc}
                alt={video.title || "Instagram video"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Bottom scrim only — keeps the photo visible, just anchors the text */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent group-hover:from-slate-900/85 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                  <Play className="h-7 w-7 text-blue-600 fill-blue-600" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <p className="text-white font-display font-semibold text-base mb-0.5 drop-shadow-sm">
                  {video.title || "Watch on Instagram"}
                </p>
                {video.caption && (
                  <p className="text-white/80 text-xs line-clamp-1">{video.caption}</p>
                )}
                {isProfileLink && (
                  <span className="inline-flex items-center gap-1 text-white/85 text-xs mt-2 font-medium">
                    <Share2 className="h-3.5 w-3.5" />
                    @ommosquitonets
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600" />
              <div className="absolute inset-0 bg-slate-900/35 group-hover:bg-slate-900/45 transition-colors flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Play className="h-8 w-8 text-teal-700 fill-teal-700" />
                </div>
                <p className="text-white font-display font-semibold text-lg mb-1 drop-shadow-sm">
                  {video.title || "Watch on Instagram"}
                </p>
                {video.caption && (
                  <p className="text-white/85 text-sm line-clamp-2">{video.caption}</p>
                )}
                {isProfileLink && (
                  <span className="inline-flex items-center gap-1 text-white/90 text-xs mt-3 font-medium">
                    <Share2 className="h-3.5 w-3.5" />
                    @ommosquitonets
                  </span>
                )}
              </div>
            </>
          )}
        </a>
      )}
    </div>
  );
}

export default function InstagramGallery({ videos }) {
  if (!videos?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 border border-blue-100">
              <Share2 className="h-4 w-4" />
              @ommosquitonets
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Installation Videos & Reels
            </h2>
            <p className="text-slate-500 max-w-xl leading-relaxed">
              See our mosquito net installations in action. Follow us on Instagram for
              the latest projects across Chennai.
            </p>
          </div>
          <a href={INSTAGRAM_PROFILE} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 shrink-0">
              <Share2 className="h-4 w-4" />
              Follow on Instagram
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {videos.slice(0, 8).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}