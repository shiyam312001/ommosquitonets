/**
 * Om Mosquito Nets — category content aligned with catalog
 */

import { getCategoryImage } from "@/lib/catalog-images";

export const CATEGORY_GROUPS = [
  {
    title: "Openable Systems",
    description: "Window and door openable mosquito net systems with aluminium profiles",
  },
  {
    title: "Retractable & Specialty",
    description: "Pleated, sliding, rollup, and honeycomb insect screen solutions",
  },
  {
    title: "Easy Install Systems",
    description: "Velcro and magnetic mesh for quick, removable protection",
  },
];

export const CATEGORIES = [
  {
    slug: "window-openable",
    name: "Window Openable",
    group: "Openable Systems",
    tagline: "3 types of window openable systems",
    description:
      "Sleek, classic, and magnetic openable window nets with aluminium 6063 alloy profiles, SS 304 mesh, and customized installation.",
    features: ["Sleek & classic profiles", "SS 304 black coated mesh", "ISO 9001 certified", "Custom sizing"],
    image: getCategoryImage("window-openable"),
  },
  {
    slug: "door-openable",
    name: "Door Openable",
    group: "Openable Systems",
    tagline: "3 types of door openable systems",
    description:
      "Classic, smart, and grill door openable systems with magnetic strip locking, aluminium handles, and pet mesh options.",
    features: ["Classic & smart doors", "Grill door design", "Magnetic strip lock", "Custom fit"],
    image: getCategoryImage("door-openable"),
  },
  {
    slug: "pleated-system",
    name: "Pleated System",
    group: "Retractable & Specialty",
    tagline: "3 types of pleated systems",
    description:
      "Elite, dual, and freedom pleated retractable mesh systems for balconies, wide windows, and home openings.",
    features: ["Elite pleated cassette", "Fiberglass mesh options", "Inside rail hook lock", "Retractable design"],
    image: getCategoryImage("pleated-system"),
  },
  {
    slug: "velcro-system",
    name: "Velcro System",
    group: "Easy Install Systems",
    tagline: "Velcro and magnetic mesh solutions",
    description:
      "Velcro mosquito nets, magnetic mesh, and magnetic door screens for easy installation and hands-free operation.",
    features: ["Hook-and-loop mount", "Magnetic auto-close", "Removable & washable", "No drilling options"],
    image: getCategoryImage("velcro-system"),
  },
  {
    slug: "sliding-system",
    name: "Sliding System",
    group: "Retractable & Specialty",
    tagline: "Smooth sliding insect screens",
    description:
      "Sliding mosquito net systems for windows and doors with smooth track operation and durable mesh.",
    features: ["Smooth sliding tracks", "Space-saving design", "Custom dimensions", "Easy maintenance"],
    image: getCategoryImage("sliding-system"),
  },
  {
    slug: "rollup-system",
    name: "Rollup System",
    group: "Retractable & Specialty",
    tagline: "Compact roll-up roller nets",
    description:
      "Roll-up roller mosquito nets that retract into a slim cassette when not in use — ideal for kitchens and windows.",
    features: ["Spring-loaded roller", "Compact cassette", "Full light when open", "Washable mesh"],
    image: getCategoryImage("rollup-system"),
  },
  {
    slug: "honey-comb",
    name: "Honey Comb",
    group: "Retractable & Specialty",
    tagline: "Honeycomb pleated fabric screens",
    description:
      "Honeycomb fabric pleated insect screen systems offering elegant aesthetics with effective mosquito protection.",
    features: ["Honeycomb fabric", "Pleated fold design", "UV-resistant options", "Modern look"],
    image: getCategoryImage("honey-comb"),
  },
];

export const PRODUCT_SYSTEMS = [
  {
    name: "Window Openable",
    subtitle: "Sleek, Classic & Magnetic",
    description:
      "Aluminium 6063 openable window nets with SS 304 mesh, PP coating, and customized installation for every window size.",
    href: "/products?category=window-openable",
    image: getCategoryImage("window-openable"),
  },
  {
    name: "Door Openable",
    subtitle: "Classic, Smart & Grill",
    description:
      "Door openable systems with magnetic strip locking, aluminium handles, and grill designs for main entrances and balconies.",
    href: "/products?category=door-openable",
    image: getCategoryImage("door-openable"),
  },
  {
    name: "Pleated System",
    subtitle: "Elite, Dual & Freedom",
    description:
      "Retractable pleated mesh for wide openings and balconies. Folds away neatly with inside rail hook locking.",
    href: "/products?category=pleated-system",
    image: getCategoryImage("pleated-system"),
  },
  {
    name: "Velcro System",
    subtitle: "Magnetic Mesh & Screens",
    description:
      "Velcro-mounted and magnetic mesh screens for hands-free, removable insect protection without drilling.",
    href: "/products?category=velcro-system",
    image: getCategoryImage("velcro-system"),
  },
];

export const NET_BENEFITS = [
  {
    title: "100% Chemical-Free",
    description: "No repellent creams or sprays — pure physical barrier protection safe for children and pets.",
  },
  {
    title: "Blocks Disease Carriers",
    description: "Effective shield against mosquitoes that spread dengue, malaria, and chikungunya.",
  },
  {
    title: "Free Site Visit",
    description: "We come to you, measure your openings, and quote per square foot — no hidden charges.",
  },
  {
    title: "Custom Every Time",
    description: "Every net is cut and fitted to your exact dimensions — no one-size-fits-all compromises.",
  },
  {
    title: "Budget-Friendly",
    description: "Transparent Chennai pricing with options from economical Velcro mesh to premium SS systems.",
  },
  {
    title: "Wide Product Range",
    description: "Doors, windows, balconies, beds, and curtains — one shop for your entire home.",
  },
];

export function getCategoriesByGroup(groupTitle) {
  return CATEGORIES.filter((c) => c.group === groupTitle);
}

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}
