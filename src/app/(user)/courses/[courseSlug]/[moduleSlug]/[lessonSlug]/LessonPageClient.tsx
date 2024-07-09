'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import BlockContent from '@sanity/block-content-to-react';
import { trpc } from '~/utils/trpc';

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

const serializers = {
  types: {
    image: (props: any) => {
      return (
        <Image
          src={props.node.url}
          alt={props.node.alt}
          width={500}
          height={300}
        />
      );
    },
    videoFile: ({ node }: { node: { videoFileUrl: string } }) => {
      return (
        <div className="video-upload">
          <video controls width="600">
            <source src={node.videoFileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    },
  },
};

export default function LessonPageClient({ lesson, prevLesson, nextLesson }: { lesson: Lesson, prevLesson: Lesson | null, nextLesson: Lesson | null }) {
  const { isLoaded, userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const completeLessonMutation = trpc.lesson.completeLesson.useMutation();
  const fetchCompletedLessons = trpc.lesson.fetchCompletedLessons.useQuery();

  useEffect(() => {
    if (fetchCompletedLessons.data) {
      setIsCompleted(fetchCompletedLessons.data.includes(lesson._id));
    }
  }, [fetchCompletedLessons.data, lesson._id]);

  const handleCompleteLesson = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      await completeLessonMutation.mutateAsync({ lessonId: lesson._id });
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">{lesson.title}</h1>
        {lesson.images && (
          <div className="flex justify-center mb-6">
            {lesson.images.map((image, index) => (
              <Image
                key={index}
                src={image.url}
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
        {lesson.videoFileUrl && (
          <div className="my-6">
            <video controls width="600">
              <source src={lesson.videoFileUrl} type="video/mp4" />
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
        <div className="mt-8 text-center">
          <button
            onClick={handleCompleteLesson}
            className={`btn ${isLoading ? 'loading' : ''}`}
            disabled={isCompleted || isLoading}
          >
            {isCompleted ? 'Lesson Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}