'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function ModulePageClient({ module, moduleSlug }: { module: Module, moduleSlug: string }) {
  const pathname = usePathname();
  const currentRoute = pathname;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">{module.title}</h1>
        <ul>
          {Array.isArray(module.lessons) && module.lessons.length > 0 ? (
            module.lessons.map((lesson) => (
              <li key={lesson._id} className="mb-2">
                <Link className="text-2xl font-semibold" href={`${currentRoute}/${lesson.slug.current}`}>{lesson.title}</Link>
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