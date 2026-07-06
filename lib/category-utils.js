import { getCategoryImage } from "@/lib/catalog-images";

export function normalizeCategory(cat, parent = null) {
  if (!cat) return null;
  return {
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    description: cat.description || "",
    tagline: cat.tagline || null,
    group: cat.group || parent?.name || null,
    features: cat.features || null,
    image: cat.image || cat.image_url || getCategoryImage(cat.slug),
  };
}

export function categoryToSystem(cat) {
  const normalized = normalizeCategory(cat);
  return {
    name: normalized.name,
    subtitle: normalized.tagline || normalized.description.slice(0, 60),
    description: normalized.description,
    href: `/products?category=${normalized.slug}`,
    image: normalized.image,
  };
}

export function getCategoriesGroupedFromList(categories) {
  if (!categories.length) return [];

  const children = categories.filter((c) => c.parent_id);
  const roots = categories.filter((c) => !c.parent_id);
  const parentIds = new Set(children.map((c) => c.parent_id));
  const groups = [];

  for (const root of roots) {
    const kids = children.filter((c) => c.parent_id === root.id);
    if (kids.length) {
      groups.push({
        title: root.name,
        description: root.description || "",
        items: kids.map((c) => normalizeCategory(c, root)),
      });
    }
  }

  const orphans = roots.filter((r) => !parentIds.has(r.id));
  if (orphans.length) {
    groups.push({
      title: "All Categories",
      description: "Browse our full range of mosquito net solutions for Chennai homes",
      items: orphans.map((c) => normalizeCategory(c)),
    });
  }

  return groups;
}
