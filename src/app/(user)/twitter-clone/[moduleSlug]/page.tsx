import { sanityClient } from '~/sanity';
import Link from 'next/link';
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

export default async function ModulePage({ params }: { params: { moduleSlug: string } }) {
  if (!params?.moduleSlug) {
    return notFound();
  }

  const module = await getModule(params.moduleSlug);

  if (!module) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">{module.title}</h1>
        <ul>
          {Array.isArray(module.lessons) ? (
            module.lessons.map((lesson) => (
              <li key={lesson._id} className="mb-2">
                <Link className="text-2xl font-semibold" href={`/twitter-clone/${params.moduleSlug}/${lesson.slug.current}`}>{lesson.title}</Link>
              </li>
            ))
          ) : (
            <li>No lessons available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const modules = await sanityClient.fetch(`*[_type == "module"]{ "slug": slug.current }`);
  return modules.map((module: { slug: string }) => ({
    moduleSlug: module.slug,
  }));
}