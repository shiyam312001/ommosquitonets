import { createClient } from "@/lib/supabase/server";
import { BUSINESS } from "@/lib/utils";

export const INSTAGRAM_PROFILE = BUSINESS.instagram;

export function getInstagramEmbedUrl(reelUrl) {
  if (!reelUrl) return null;
  const match = reelUrl.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  if (match) return `https://www.instagram.com/reel/${match[1]}/embed`;
  return null;
}

export async function getInstagramVideos() {
  const supabase = await createClient();
  if (!supabase) return getFallbackVideos();

  const { data } = await supabase
    .from("instagram_videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (data?.length) return data;
  return getFallbackVideos();
}

// Thumbnails for these live at the public root: /public/thumbnail-1.png, etc.
// If you swap in real Instagram thumbnails via Supabase later, just set
// thumbnail_url on each row there — this fallback set only kicks in when
// Supabase has no active rows.
function getFallbackVideos() {
  return [
    {
      id: "fallback-1",
      title: "Our Installations",
      reel_url: INSTAGRAM_PROFILE,
      caption: "Follow @ommosquitonets for installation videos and reels",
      thumbnail_url: "/thumbnail-1.png",
    },
    {
      id: "fallback-2",
      title: "Pleated Systems",
      reel_url: INSTAGRAM_PROFILE,
      caption: "See pleated mosquito nets in action",
      thumbnail_url: "/thumbnail-2.png",
    },
    {
      id: "fallback-3",
      title: "Door & Window Nets",
      reel_url: INSTAGRAM_PROFILE,
      caption: "Professional fitting across Chennai",
      thumbnail_url: "/thumbnail-3.png",
    },
  ];
}