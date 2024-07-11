// src/app/auth/layout.tsx
import { type PropsWithChildren } from 'react';
import MoharaLogo from '~/app/_components/MoharaLogo';

export default function SignUpSignInLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-screen grid-cols-2">
      <div className="flex h-screen items-center justify-center bg-white">
        <MoharaLogo />
      </div>
      <div className="ml-8 flex flex-col items-start justify-center gap-5">
        {children}
      </div>
    </div>
  );
}
