import { sanityClient } from '~/sanity';
import ModulePageClient from './ModulePageClient';
import { notFound } from 'next/navigation';

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Module {
  _id: string;
  title: string;
  slug: { current: string };
  lessons: Lesson[];
}

async function getModule(slug: string): Promise<Module | null> {
  try {
    const module = await sanityClient.fetch(
      `*[_type == "module" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        "lessons": lessons[]->{
          _id,
          title,
          slug
        }
      }`,
      { slug }
    );
    return module;
  } catch (error) {
    console.error("Failed to fetch module data:", error);
    return null;
  }
}

export default async function ServerModulePage({ params }: { params: { moduleSlug: string } }) {
  if (!params?.moduleSlug) {
    return notFound();
  }

  const module = await getModule(params.moduleSlug);

  if (!module) {
    return notFound();
  }

  return <ModulePageClient module={module} moduleSlug={params.moduleSlug} />;
}

export async function generateStaticParams() {
  const modules = await sanityClient.fetch(`*[_type == "module"]{ "slug": slug.current }`);
  return modules.map((module: { slug: string }) => ({
    moduleSlug: module.slug,
  }));
}