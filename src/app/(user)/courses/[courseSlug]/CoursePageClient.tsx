'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Module {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
}

export default function CoursePageClient({ modules = [] }: { modules: Module[] }) {
  const pathname = usePathname();
  const currentRoute = pathname;

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h1 className="text-4xl font-bold">Welcome to the Twitter Clone Course</h1>
        <p className="mt-4 text-xl">Learn how to build a Twitter clone using the T3 stack.</p>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">About This Course</h2>
          <p className="mt-4 text-lg">This course will guide you through building a full-featured Twitter clone using the latest technologies in the T3 stack.</p>
        </div>
      </section>

      {/* Modules Overview Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center">Course Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {modules.length > 0 ? (
              modules.map((module) => (
                <Link key={module._id} href={`${currentRoute}/${module.slug.current}`}>
                  <div className="block transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-white p-4 shadow-lg rounded-lg">
                      <h3 className="text-2xl font-bold mt-4">{module.title}</h3>
                      <p className="mt-2">{module.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No modules found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="mt-4 text-lg">Have questions? Feel free to reach out to us at <a href="mailto:support@mohara.co" className="text-blue-600 hover:underline">support@coursewebsite.com</a>.</p>
        </div>
      </section>
    </div>
  );
}