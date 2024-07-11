import { sanityClient } from '~/sanity';
import CoursePageClient from './CoursePageClient';

interface Module {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  lessons: { _id: string }[];
}

async function getModules() {
  const modules = await sanityClient.fetch(
    `*[_type == "module"]{_id, title, slug, description, "lessons": lessons[]->{_id}}`,
  );
  return modules;
}

export default async function ServerCoursePage() {
  const modules: Module[] = await getModules();
  return <CoursePageClient modules={modules} />;
}
