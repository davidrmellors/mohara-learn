import { sanityClient, urlFor } from '../../sanity';
import Link from 'next/link';
import Image from 'next/image';

interface Lesson {
  _id: string;
  title: string;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
  image?: {
    asset: {
      _ref: string;
    };
  };
}

export async function getModule(id: string): Promise<Module | null> {
  try {
    const module = await sanityClient.fetch(
      `*[_type == "module" && _id == $id][0]{
        _id,
        title,
        lessons[]->{
          _id,
          title
        },
        image
      }`,
      { id }
    );
    return module;
  } catch (error) {
    console.error("Failed to fetch module data:", error);
    return null;
  }
}

const ModuleComponent: React.FC<{ module: Module }> = ({ module }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">{module.title}</h1>
        {module.image && (
          <div className="flex justify-center mb-6">
            <Image
              src={urlFor(module.image).url()}
              alt={module.title}
              width={500}
              height={300}
            />
          </div>
        )}
        <ul>
          {module.lessons.map((lesson) => (
            <li key={lesson._id} className="mb-2">
              <Link href={`/lesson/${lesson._id}`} legacyBehavior>
                <a className="text-blue-500 hover:underline">{lesson.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModuleComponent;
