import { getCategoryImage } from "@/lib/catalog-images";
import { getCategoryBySlug as getStaticCategory } from "@/lib/categories-content";

export function isVideoMedia(src) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(src || "");
}

export function parseCategoryMedia(cat) {
  if (!cat) return [];
  if (Array.isArray(cat.media) && cat.media.length) return cat.media.filter(Boolean);
  if (typeof cat.media === "string") {
    try {
      const parsed = JSON.parse(cat.media);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      /* ignore */
    }
  }
  if (cat.image_url) return [cat.image_url];
  if (cat.image) return [cat.image];
  return [];
}

export function normalizeCategory(cat, parent = null) {
  if (!cat) return null;

  const staticFallback = getStaticCategory(cat.slug);
  const media = parseCategoryMedia(cat);
  const fallbackImage = staticFallback?.image || getCategoryImage(cat.slug);

  return {
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    description: cat.description || staticFallback?.description || "",
    tagline: cat.tagline || staticFallback?.tagline || null,
    group: cat.group || parent?.name || staticFallback?.group || null,
    features: cat.features || staticFallback?.features || null,
    specifications: cat.specifications || null,
    parent_id: cat.parent_id || null,
    sort_order: cat.sort_order ?? 0,
    media,
    image: media[0] || cat.image || cat.image_url || fallbackImage,
  };
}

function getCategoryDisplayCopy(normalized) {
  const staticCat = getStaticCategory(normalized.slug);
  const tagline = normalized.tagline || staticCat?.tagline || null;

  const rawDesc = (staticCat?.description || normalized.description || "").trim();
  const isDuplicate =
    !rawDesc ||
    rawDesc.toLowerCase() === normalized.name.toLowerCase() ||
    (tagline && rawDesc.toLowerCase() === tagline.toLowerCase());

  const description = isDuplicate
    ? `Custom ${normalized.name.toLowerCase()} with professional measurement and installation across Chennai.`
    : rawDesc;

  return {
    tagline: tagline && tagline.length <= 72 ? tagline : null,
    description: description.length > 160 ? `${description.slice(0, 157)}…` : description,
  };
}

export function categoryToSystem(cat) {
  const normalized = normalizeCategory(cat);
  const staticCat = getStaticCategory(normalized.slug);
  const { tagline, description } = getCategoryDisplayCopy(normalized);

  return {
    name: normalized.name,
    tagline,
    description,
    href: `/categories/${normalized.slug}`,
    image: staticCat?.image || getCategoryImage(normalized.slug) || normalized.image,
    features: normalized.features?.slice(0, 3) || staticCat?.features?.slice(0, 3) || [],
  };
}

export function getCategoriesGroupedFromList(categories) {
  if (!categories.length) return [];

  const children = categories.filter((c) => c.parent_id);
  const roots = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const parentIds = new Set(children.map((c) => c.parent_id));
  const groups = [];

  for (const root of roots) {
    const kids = children
      .filter((c) => c.parent_id === root.id)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    if (kids.length) {
      groups.push({
        title: root.name,
        description: root.description || root.tagline || "",
        slug: root.slug,
        image: root.image_url || getCategoryImage(root.slug),
        items: kids.map((c) => normalizeCategory(c, root)),
      });
    }
  }

  const orphans = roots.filter((r) => !parentIds.has(r.id));
  if (orphans.length) {
    groups.push({
      title: "Our Solutions",
      description: "Browse our full range of mosquito net solutions for Chennai homes",
      slug: null,
      image: null,
      items: orphans.map((c) => normalizeCategory(c)),
    });
  }

  return groups;
}

export function getCategoryTree(categories) {
  const roots = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return roots.map((root) => {
    const children = categories
      .filter((c) => c.parent_id === root.id)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return {
      ...normalizeCategory(root),
      children: children.map((c) => normalizeCategory(c, root)),
    };
  });
}

export function getSubcategories(categories, parentId) {
  return categories
    .filter((c) => c.parent_id === parentId)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((c) => {
      const parent = categories.find((p) => p.id === parentId);
      return normalizeCategory(c, parent);
    });
}

export function getRootCategories(categories) {
  return categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((c) => normalizeCategory(c));
}
