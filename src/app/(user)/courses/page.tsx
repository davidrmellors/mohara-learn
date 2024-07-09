import Link from 'next/link'
import { sanityClient } from '~/sanity';

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
}

async function getCourses() {
  const courses = await sanityClient.fetch(`*[_type == "course"]{_id, title, slug, description}`);
  return courses;
}

export default async function Home() {
  const courses: Course[] = await getCourses();

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h1 className="text-4xl font-bold">Welcome to Mohara Courses</h1>
      </section>

      {/* Course Overview Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {courses.map((course) => (
              <Link key={course._id} href={`/courses/${course.slug.current}`} className='hover:scale-105'>
              <div className="block bg-white p-4 shadow-lg rounded-lg hover:shadow-xl  transition-shadow duration-300">
                <h3 className="text-2xl font-bold mt-4">{course.title}</h3>
                <p className="mt-2">{course.description}</p>
                <p className="text-blue-600 hover:underline mt-4">Learn more</p>
              </div>
            </Link>
            ))}
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