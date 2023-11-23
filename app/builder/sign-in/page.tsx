'use client';

import { useSearchParams } from 'next/navigation';
import { SignInPage } from 'visio-cms';

const Page = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '';

  async function handleLogin(formData: FormData) {
    // let email = (formData.get('email') as string) || null;
    // let password = (formData.get('password') as string) || null;
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await res.json();
    // if (data.success) {
    //   if (page) {
    //     router.replace(`${page}`);
    //   } else {
    //     router.replace('/builder/index');
    //   }
    // } else {
    //   // toast({ title: 'Failed', description: data.error, variant: 'destructive' });
    // }
  }

  return <SignInPage page={page} />;
};

export default Page;
