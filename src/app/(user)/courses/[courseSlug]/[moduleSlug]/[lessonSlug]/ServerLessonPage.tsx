import { sanityClient } from '~/sanity';
import LessonPageClient from './LessonPageClient';
import { notFound } from 'next/navigation';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface ImageType {
  asset: {
    url: string;
  };
  url: string;
}

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  content: any;
  images: ImageType[];
  videoFileUrl?: string;
}

const builder = imageUrlBuilder(sanityClient);

function urlFor(source: SanityImageSource) {
  return builder.image(source).url();
}

function getVideoFileUrl(ref: string): string {
  const [fileType, id, extension] = ref.split('-');
  return `https://cdn.sanity.io/files/${sanityClient.config().projectId}/${sanityClient.config().dataset}/${id}.${extension}`;
}

async function getLessonAndAdjacent(lessonSlug: string): Promise<{ lesson: Lesson | null, prevLesson: Lesson | null, nextLesson: Lesson | null }> {
  try {
    // Fetch the single lesson based on the slug
    const lesson = await sanityClient.fetch(`
      *[_type == "lesson" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        content[]{
          ...,
          _type == "videoFile" => {
            "videoFileUrl": asset->url
          },
          _type == "image" => {
            "imageUrl": asset->url
          }
        }
      }
    `, { slug: lessonSlug });

    if (!lesson) {
      return { lesson: null, prevLesson: null, nextLesson: null };
    }

    // Fetch all lessons to find the current index and adjacent lessons
    const allLessons = await sanityClient.fetch(`
      *[_type == "lesson"] | order(_createdAt asc){
        _id,
        title,
        slug
      }
    `);

    const currentIndex = allLessons.findIndex((l: { slug: { current: string } }) => l.slug.current === lessonSlug);

    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return { lesson, prevLesson, nextLesson };
  } catch (error) {
    console.error("Failed to fetch lesson data:", error);
    return { lesson: null, prevLesson: null, nextLesson: null };
  }
}

export default async function ServerLessonPage({ params }: { params: { lessonSlug: string } }) {
  if (!params?.lessonSlug) {
    return notFound();
  }

  const { lesson, prevLesson, nextLesson } = await getLessonAndAdjacent(params.lessonSlug);

  if (!lesson) {
    return notFound();
  }

  return <LessonPageClient lesson={lesson} prevLesson={prevLesson} nextLesson={nextLesson} />;
}

export async function generateStaticParams() {
  const lessons = await sanityClient.fetch(`
    *[_type == "lesson"]{
      _id,
      "slug": slug.current
    }
  `);

  console.log('Fetched Lessons:', lessons);

  return lessons.map((lesson: { slug: string }) => ({
    lessonSlug: lesson.slug,
  }));
}