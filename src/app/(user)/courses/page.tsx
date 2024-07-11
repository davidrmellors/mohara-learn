import { sanityClient } from '~/sanity';
import CoursesClient from './CoursesClient';

export const revalidate = 60; // Revalidate every 60 seconds

const fetchCourses = async () => {
  const coursesData = await sanityClient.fetch(
    `*[_type == "course"]{_id, title, slug}`,
  );
  return coursesData;
};

const CoursesPage = async () => {
  const courses = await fetchCourses();

  return <CoursesClient courses={courses} />;
};

export default CoursesPage;
