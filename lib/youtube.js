export const YOUTUBE_CHANNEL = "https://www.youtube.com/@ommosquitonets";

/**
 * Extracts a YouTube video ID from common URL formats and returns
 * an embeddable URL, or null if the URL doesn't contain a video ID
 * (e.g. it's just a channel/profile link).
 */
export function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null;
}