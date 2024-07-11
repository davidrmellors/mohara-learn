'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trpc } from '~/utils/trpc';
import { useMemo } from 'react';

interface Module {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  lessons: { _id: string }[];
}

export default function CoursePageClient({
  modules = [],
}: {
  modules: Module[];
}) {
  const pathname = usePathname();
  const currentRoute = pathname;

  const fetchCompletedLessons = trpc.lesson.fetchCompletedLessons.useQuery();
  const completedLessonIds = fetchCompletedLessons.data || [];

  const { totalLessons, completedLessons } = useMemo(() => {
    let total = 0;
    let completed = 0;

    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        total++;
        if (completedLessonIds.includes(lesson._id)) {
          completed++;
        }
      });
    });

    return { totalLessons: total, completedLessons: completed };
  }, [modules, completedLessonIds]);

  const percentageComplete = useMemo(
    () =>
      totalLessons > 0
        ? Number(((completedLessons / totalLessons) * 100).toFixed(2))
        : 0,
    [totalLessons, completedLessons],
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h1 className="text-4xl font-bold">
          Welcome to the Twitter Clone Course
        </h1>
        <p className="mt-4 text-xl">
          Learn how to build a Twitter clone using the T3 stack.
        </p>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold">About This Course</h2>
          <p className="mt-4 text-lg">
            This course will guide you through building a full-featured Twitter
            clone using the latest technologies in the T3 stack.
          </p>
        </div>
      </section>

      {/* Modules Overview Section */}
      <section className="bg-gray-100 py-16 flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Course Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {modules.length > 0 ? (
              modules.map((module) => (
                <Link
                  key={module._id}
                  href={`${currentRoute}/${module.slug.current}`}
                >
                  <div className="block transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-2xl font-bold">{module.title}</h3>
                        <p className="mt-2 text-gray-700">
                          {module.description}
                        </p>
                      </div>
                      <p className="mt-4 font-bold text-gray-900">
                        {percentageComplete}% Completed
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-1 sm:col-span-2 lg:col-span-3 text-center">
                No modules found.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
