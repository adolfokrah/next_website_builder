'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/ui/builderLayout/submitButton';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

const Page = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    let email = (formData.get('email') as string) || null;
    let password = (formData.get('password') as string) || null;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      if (page) {
        router.replace(`${page}`);
      } else {
        router.replace('/builder/index');
      }
    } else {
      toast({ title: 'Failed', description: data.error, variant: 'destructive' });
    }
  }

  return (
    <div className="w-full h-screen grid place-items-center bg-slate-50">
      <Card>
        <CardContent>
          <form action={handleLogin}>
            <div className=" mt-4 w-[300px]">
              <Label htmlFor="pageName" className=" text-xs font-medium">
                Email
              </Label>
              <Input id="pageName" name="email" type="email" className="w-full mt-2" />
            </div>

            <div className="w-full mt-4">
              <Label htmlFor="slug" className=" text-xs font-medium">
                Password
              </Label>
              <Input id="slug" name="password" type="password" className="w-full mb-7 mt-2" />
            </div>
            <SubmitButton title="Sign in" loadingTitle="Please wait..." />
          </form>

          <div className="mt-4">
            <Link href="/lost-password" className="text-xs">
              Lost your password?
            </Link>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default Page;
