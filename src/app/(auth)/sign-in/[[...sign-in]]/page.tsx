import { SignIn } from '@clerk/nextjs';

const SignInPage = () => (
  <div className="container mx-auto p-4">
    <SignIn forceRedirectUrl={'/courses'}/>
  </div>
);

export default SignInPage;
