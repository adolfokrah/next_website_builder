'use client';

import { useSearchParams } from 'next/navigation';
import { SignInPage } from 'visio-cms';

const Page = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '';

  return <SignInPage page={page} projectId={process.env.NEXT_PUBLIC_PROJECT_ID} />;
};

export default Page;
