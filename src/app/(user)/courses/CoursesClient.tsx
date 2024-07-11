'use client';

import React from 'react';
import Link from 'next/link';
import { trpc } from '~/utils/trpc';

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
}

interface CoursesClientProps {
  courses: Course[];
}

const CoursesClient = ({ courses }: CoursesClientProps) => {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {courses.map((course) => {
          const { data, isLoading } = trpc.course.getCourseProgress.useQuery({
            courseId: course._id,
          });

          return (
            <Link key={course._id} href={`/courses/${course.slug.current}`}>
              <div className="block bg-white p-4 shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold mt-4">{course.title}</h3>
                <p className="mt-2">
                  Completion:{' '}
                  {isLoading
                    ? 'Loading...'
                    : data
                      ? data.completionPercentage.toFixed(2)
                      : 'Error'}
                  %
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesClient;
