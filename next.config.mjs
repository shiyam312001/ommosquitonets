/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@whiskeysockets/baileys"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "psrxltkylnshnithozct.supabase.co" },
    ],
  },
};

export default nextConfig;
