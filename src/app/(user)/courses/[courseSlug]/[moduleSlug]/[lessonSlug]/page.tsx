import ServerLessonPage from './ServerLessonPage';

export default function Page({ params }: { params: { lessonSlug: string } }) {
  return <ServerLessonPage params={params} />;
}