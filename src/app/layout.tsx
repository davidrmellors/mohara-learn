import '~/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { TRPCReactProvider } from '~/trpc/react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import Image from 'next/image';

export const metadata = {
  title: 'Course Website',
  description: 'Learn how to build a Twitter clone using the T3 stack',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} h-full`}>
        <body className="h-full w-full p-0 m-0 flex flex-col">
          <header className="bg-black text-white p-4">
            <nav className="container mx-auto relative flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={'/images/MoharaLogoWhite.png'}
                  alt="MoharaLogo"
                  width={50}
                  height={50}
                />
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <a href="/" className="text-xl font-bold">
                  Mohara Learn
                </a>
              </div>
              <ul className="flex space-x-4">
                <li>
                  <a href="/about" className="hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="/twitter-clone" className="hover:underline">
                    Modules
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow w-full mx-0">
            <SignedIn>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </main>
          <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
              &copy; {new Date().getFullYear()} Mohara. All rights reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
