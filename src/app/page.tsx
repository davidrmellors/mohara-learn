import Link from 'next/link';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Mohara's Internal Courses</h1>
        <p className="mb-8 text-lg">Enhance your skills with our internal courses. Please sign up or log in to access the content.</p>
        <div className="flex space-x-4 justify-center">
          <Link href="/sign-up" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
              Sign Up
          </Link>
          <Link href="/sign-in" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
              Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}