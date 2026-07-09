import Image from "next/image";

const ALLOWED_HOSTS = new Set([
  "images.unsplash.com",
  "www.rfinteriorspot.com",
  "rfinteriorspot.com",
]);

export function isNextImageHost(src) {
  if (!src || src.startsWith("/")) return true;

  try {
    const { hostname } = new URL(src);
    if (ALLOWED_HOSTS.has(hostname)) return true;
    return false;
  } catch {
    return false;
  }
}

function isSupabaseHost(src) {
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function NativeImage({ src, alt, fill, width, height, className, priority }) {
  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className || ""}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export default function RemoteImage({
  src,
  alt = "",
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  ...rest
}) {
  if (!src) return null;

  // Supabase storage: bypass next/image optimizer (avoids private IP resolution errors)
  if (isSupabaseHost(src)) {
    return (
      <NativeImage
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  if (isNextImageHost(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        {...rest}
      />
    );
  }

  return (
    <NativeImage
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
