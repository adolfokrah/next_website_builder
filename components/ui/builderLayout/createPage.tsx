'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createNewPage } from '@/lib/actions/pageActions';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { ToasterProps } from '@/lib/types';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/ui/builderLayout/submitButton';

const CreatePage = ({ slug }: { slug?: string }) => {
  const { toast } = useToast();
  const router = useRouter();

  async function handleCreatePage(formData: FormData) {
    let name = (formData.get('name') as string) || null;
    let formSlug = (formData.get('slug') as string) || null;

    if (name && formSlug) {
      if (formSlug?.charAt(0) != '/') {
        toast({ title: 'Failed', description: 'slug name should start with /', variant: 'destructive' });
        return;
      }
      let data = await createNewPage({ name, slug: formSlug });
      if (data.error) {
        toast({ title: 'Failed', description: data.error, variant: 'destructive' });
        return;
      }
      if (slug != data.data?.slug) {
        router.replace(`/builder${data.data?.slug}` || '/');
      } else {
        router.refresh();
      }
    } else {
      toast({ title: 'Failed', description: 'Both page name and slug needed', variant: 'destructive' });
    }
  }
  return (
    <form action={handleCreatePage}>
      <div className="w-full">
        <Label htmlFor="pageName" className=" text-xs font-medium">
          Page Name
        </Label>
        <Input id="pageName" name="name" type="text" placeholder="eg. Home page" className="w-full mt-2" />
      </div>

      <div className="w-full mt-4">
        <Label htmlFor="slug" className=" text-xs font-medium">
          Slug
        </Label>
        <Input
          id="slug"
          defaultValue={slug || ''}
          name="slug"
          type="text"
          placeholder="eg. /my-home-page"
          className="w-full mb-7 mt-2"
        />
      </div>
      <SubmitButton title="Create page" loadingTitle="Creating..." />
    </form>
  );
};

export default CreatePage;
