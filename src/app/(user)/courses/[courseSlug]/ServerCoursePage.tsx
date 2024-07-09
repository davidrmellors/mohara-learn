import { sanityClient } from '~/sanity';
import CoursePageClient from './CoursePageClient';

interface Module {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
}

async function getModules() {
  const modules = await sanityClient.fetch(`*[_type == "module"]{_id, title, slug, description}`);
  return modules;
}

export default async function ServerCoursePage() {
  const modules: Module[] = await getModules();
  return <CoursePageClient modules={modules} />;
}