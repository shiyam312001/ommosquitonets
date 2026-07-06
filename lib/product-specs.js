import { BUSINESS, getWhatsAppLink } from "@/lib/utils";

export const SPEC_LABELS = {
  sizeRange: "Size Range",
  profile: "Profile",
  coating: "Coating",
  components: "Components",
  mesh: "Mesh",
  installation: "Installation",
  lockMode: "Lock Mode",
  rubber: "Rubber",
  verification: "Verification",
  handle: "Handle",
  woolPile: "Wool Pile",
  material: "Material",
  usage: "Usage",
  packing: "Packing",
  description: "Description",
};

export function formatSpecLabel(key) {
  if (SPEC_LABELS[key]) return SPEC_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function hasSpecifications(specifications) {
  return specifications && typeof specifications === "object" && Object.keys(specifications).length > 0;
}

export function buildProductEnquiryMessage(product) {
  const categoryName = product.categories?.name || product.category_name || "";
  const parts = [
    `Hi ${BUSINESS.name}!`,
    `I would like to enquire about ${product.name}`,
  ];

  if (product.model) parts.push(`Model: ${product.model}`);
  if (categoryName) parts.push(`Category: ${categoryName}`);
  parts.push("Please share pricing, sizing options, and installation details.");

  return parts.join("\n");
}

export function getProductEnquiryLink(product) {
  return getWhatsAppLink(buildProductEnquiryMessage(product));
}
