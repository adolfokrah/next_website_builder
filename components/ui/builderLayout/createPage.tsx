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
  const [error, setError] = useState<ToasterProps>();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast({
        title: error?.title,
        description: error?.description,
        variant: error?.type,
      });
    }
  }, [error]);

  async function handleCreatePage(formData: FormData) {
    let name = (formData.get('name') as string) || null;
    let slug = (formData.get('slug') as string) || null;

    if (name && slug) {
      if (slug?.charAt(0) != '/') {
        setError({ title: 'Failed', description: 'slug name should start with /', type: 'destructive' });
        return;
      }
      let data = await createNewPage({ name, slug });
      if (data.error) {
        setError({ title: 'Failed', description: data.error, type: 'destructive' });
        return;
      }
      if (slug != data.data?.slug) {
        router.replace(`/builder${data.data?.slug}` || '/');
      } else {
        router.refresh();
      }
    } else {
      setError({ title: 'Failed', description: 'Both page name and slug needed', type: 'destructive' });
    }
  }
  return (
    <form action={handleCreatePage}>
      <div className="w-full">
        <Label htmlFor="pageName" className=" text-sm">
          Page Name
        </Label>
        <Input id="pageName" name="name" type="text" placeholder="eg. Home page" className="w-full mt-2" />
      </div>

      <div className="w-full mt-4">
        <Label htmlFor="slug" className=" text-sm">
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
