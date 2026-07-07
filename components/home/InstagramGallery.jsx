import Link from "next/link";
import Image from "next/image";
import { Share2, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { getInstagramEmbedUrl, INSTAGRAM_PROFILE } from "@/lib/instagram";

function VideoCard({ video }) {
  const embedUrl = getInstagramEmbedUrl(video.reel_url);
  const isProfileLink = !embedUrl;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 ring-1 ring-white/10">
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
          {video.thumbnail_url ? (
            <Image
              src={video.thumbnail_url}
              alt={video.title || "Instagram video"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
          )}
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition-colors flex flex-col items-center justify-center p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
            <p className="text-white font-display font-semibold text-lg mb-1">
              {video.title || "Watch on Instagram"}
            </p>
            {video.caption && (
              <p className="text-white/80 text-sm line-clamp-2">{video.caption}</p>
            )}
            {isProfileLink && (
              <span className="inline-flex items-center gap-1 text-white/90 text-xs mt-3 font-medium">
                <Share2 className="h-3.5 w-3.5" />
                @ommosquitonets
              </span>
            )}
          </div>
        </a>
      )}
    </div>
  );
}

export default function InstagramGallery({ videos }) {
  if (!videos?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 text-sm font-medium mb-4 border border-pink-500/20">
              <Share2 className="h-4 w-4" />
              @ommosquitonets
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Installation Videos & Reels
            </h2>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              See our mosquito net installations in action. Follow us on Instagram for
              the latest projects across Chennai.
            </p>
          </div>
          <a href={INSTAGRAM_PROFILE} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 shrink-0">
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
