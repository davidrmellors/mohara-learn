import '~/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { TRPCReactProvider } from '~/trpc/react';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';

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
        <body className=" h-full">
          <header className="bg-black text-white p-4">
            <nav className="container mx-auto flex justify-between">
              <a href="/" className="text-xl font-bold">
                Mohara Learn
              </a>
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
          <main className="container mx-auto p-4 h-full">
            <SignedIn>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </main>
          <footer className="bg-gray-800 text-white p-4 mt-8">
            <div className="container mx-auto text-center">
              &copy; {new Date().getFullYear()} Mohara. All rights reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
