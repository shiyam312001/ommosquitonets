import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { CartHydration } from "@/components/CartHydration";
import { AuthProvider } from "@/context/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "Om Mosquito Nets | Premium Mosquito Nets & Curtains in Chennai",
  description:
    "Premium mosquito nets, curtains, insect screens & installation services in Chennai. Custom fit, durable quality. Call 090642 44204.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-body bg-white text-slate-900 antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartHydration />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
