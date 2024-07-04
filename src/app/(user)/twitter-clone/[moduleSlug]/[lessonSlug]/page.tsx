import { sanityClient, urlFor as sanityUrlFor } from '~/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlockContent from '@sanity/block-content-to-react';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  content: any;
  images: { asset: { url: string } }[];
  videoEmbed?: { url: string, title: string };
  video?: { asset: { _ref: string } };
}

// Set up the URL builder for images
const builder = imageUrlBuilder(sanityClient);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

function getVideoUrl(ref: string): string {
  const [fileType, id, extension] = ref.split('-');
  return `https://cdn.sanity.io/files/${sanityClient.config().projectId}/${sanityClient.config().dataset}/${id}.${extension}`;
}

async function getLessonAndAdjacent(lessonSlug: string): Promise<{ lesson: Lesson | null, prevLesson: Lesson | null, nextLesson: Lesson | null }> {
  try {
    const lessons = await sanityClient.fetch(`
      *[_type == "lesson"] | order(_createdAt asc){
        _id,
        title,
        slug,
        content,
        images[]{
          asset->{
            url
          }
        },
        videoEmbed,
        video {
          asset->{
            _ref
          }
        }
      }
    `);

    const currentIndex = lessons.findIndex((lesson: { slug: { current: string } }) => lesson.slug.current === lessonSlug);

    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
    const lesson = lessons[currentIndex] || null;

    return { lesson, prevLesson, nextLesson };
  } catch (error) {
    console.error("Failed to fetch lesson data:", error);
    return { lesson: null, prevLesson: null, nextLesson: null };
  }
}

const serializers = {
  types: {
    image: (props: any) => {
      return (
        <Image
          src={urlFor(props.node.asset).url()}
          alt={props.node.alt}
          width={500}
          height={300}
        />
      );
    },
    videoEmbed: ({ node }: { node: { url: string, title: string } }) => (
      <div className="video-embed">
        <iframe
          width="560"
          height="315"
          src={node.url}
          title={node.title}
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    ),
    video: ({ node }: { node: { asset: { _ref: string } } }) => {
      const videoUrl = getVideoUrl(node.asset._ref);
      return (
        <div className="video-upload">
          <video controls width="600">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    },
  },
};

export default async function LessonPage({ params }: { params: { lessonSlug: string } }) {
  if (!params?.lessonSlug) {
    return notFound();
  }

  const { lesson, prevLesson, nextLesson } = await getLessonAndAdjacent(params.lessonSlug);

  if (!lesson) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">{lesson.title}</h1>
        {lesson.images && (
          <div className="flex justify-center mb-6">
            {lesson.images.map((image, index) => (
              <Image
                key={index}
                src={image.asset.url}
                alt={lesson.title}
                width={500}
                height={300}
              />
            ))}
          </div>
        )}
        <BlockContent
          blocks={lesson.content}
          serializers={serializers}
          projectId="x5lxqimq"
          dataset="production"
        />
        {lesson.videoEmbed && (
          <div className="my-6">
            <iframe
              width="560"
              height="315"
              src={lesson.videoEmbed.url}
              title={lesson.videoEmbed.title}
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {lesson.video && (
          <div className="my-6">
            <video controls width="600">
              <source src={getVideoUrl(lesson.video.asset._ref)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <div className="flex justify-between mt-8">
          {prevLesson && (
            <Link href={`./${prevLesson.slug.current}`} className="text-blue-600 hover:underline">
              Previous: {prevLesson.title}
            </Link>
          )}
          {nextLesson && (
            <Link href={`./${nextLesson.slug.current}`} className="text-blue-600 hover:underline">
              Next: {nextLesson.title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
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