import { Phone, MapPin, Share2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { BUSINESS } from "@/lib/utils";

export const metadata = {
  title: "Contact Us | Om Mosquito Nets",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-slate-600">Get in touch for custom quotes, installation, or any questions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <Card>
            <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Call Us</p>
                <p className="font-semibold text-slate-900">{BUSINESS.phone}</p>
              </div>
            </a>
          </Card>

          <Card>
            <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">WhatsApp</p>
                <p className="font-semibold text-slate-900">Chat with us</p>
              </div>
            </a>
          </Card>

          <Card>
            <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Instagram</p>
                <p className="font-semibold text-slate-900">@ommosquitonets</p>
              </div>
            </a>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Address</p>
                <p className="text-slate-900 text-sm leading-relaxed">{BUSINESS.address}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="rounded-2xl overflow-hidden h-80 md:h-full min-h-[320px] bg-slate-100">
          <iframe
            title="Om Mosquito Nets Location"
            src="https://maps.google.com/maps?q=Kamadhenu+Nagar+Thiruverkadu+Chennai&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
