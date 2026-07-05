export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getEffectivePrice(product) {
  return product.discount_price ?? product.base_price;
}

export function calculateDiscount(base, discount) {
  if (!discount || discount >= base) return 0;
  return Math.round(((base - discount) / base) * 100);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export const BUSINESS = {
  name: "Om Mosquito Nets",
  phone: "090642 44204",
  phoneRaw: "919064244204",
  address:
    "No.155, 5th St, near Appalam Company, Kamadhenu Nagar, Thiruverkadu, Chennai, Tamil Nadu 600077",
  instagram: "https://instagram.com/ommosquitonets",
  whatsapp: "https://wa.me/919064244204",
};
