import { notFound } from "next/navigation";
import CategoryDetailView from "@/components/categories/CategoryDetailView";
import { getCategoryWithChildren } from "@/lib/categories";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getCategoryWithChildren(slug);
  if (!data) return { title: "Category Not Found" };

  return {
    title: `${data.category.name} | Om Mosquito Nets Chennai`,
    description: data.category.description || data.category.tagline || `Explore ${data.category.name} mosquito net solutions in Chennai.`,
  };
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const data = await getCategoryWithChildren(slug);

  if (!data) notFound();

  return (
    <CategoryDetailView
      category={data.category}
      parent={data.parent}
      children={data.children}
    />
  );
}
