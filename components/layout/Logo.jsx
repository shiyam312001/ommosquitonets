import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { height: 32, width: 120 },
  md: { height: 40, width: 150 },
  lg: { height: 48, width: 180 },
  header: { height: 150, width: 260 },
  xl: { height: 64, width: 240 },
};

export default function Logo({
  href = "/",
  size = "md",
  className,
  imageClassName,
  priority = false,
}) {
  const { height, width } = sizes[size] || sizes.md;

  const image = (
    <Image
      src="/logo.png"
      alt="Om Mosquito Nets — Smart Insect Solutions"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", imageClassName)}
      style={{ height, width: "auto", maxWidth: width }}
    />
  );

  if (!href) {
    return <div className={cn("inline-flex shrink-0", className)}>{image}</div>;
  }

  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      {image}
    </Link>
  );
}
