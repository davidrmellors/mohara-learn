import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => (
  <div className="container mx-auto p-4">
    <SignUp forceRedirectUrl={'/sign-in'} />
  </div>
);

export default SignUpPage;
