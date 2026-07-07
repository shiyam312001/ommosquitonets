import { BUSINESS, getWhatsAppLink } from "@/lib/utils";
import { formatSpecLabel, hasSpecifications } from "@/lib/product-specs";

export { formatSpecLabel, hasSpecifications };

export function buildCategoryEnquiryMessage(category, parent = null) {
  const parts = [
    `Hi ${BUSINESS.name}!`,
    `I would like to enquire about ${category.name}`,
  ];

  if (parent?.name) parts.push(`Category: ${parent.name}`);
  if (category.tagline) parts.push(category.tagline);
  parts.push("Please share pricing, sizing options, and installation details.");

  return parts.join("\n");
}

export function getCategoryEnquiryLink(category, parent = null) {
  return getWhatsAppLink(buildCategoryEnquiryMessage(category, parent));
}
