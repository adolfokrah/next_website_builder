'use client';

import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { Input } from '../input';
import { Textarea } from '../textarea';
import SubmitButton from './submitButton';
import { useToast } from '../use-toast';
import { ToasterProps } from '@/lib/types';
import { deletePage, updatePageSettings } from '@/lib/actions/pageActions';
import { Button } from '../button';
import { CopyIcon, Dot, PlusIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import lodash from 'lodash';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import CreatePage from './createPage';

type SideBarProps = {
  id: string;
  name: string;
  slug: string;
  metaTitle?: string | null;
  metaKeyWords?: string | null;
  metaDescription?: string | null;
  featuredImage?: string | null;
};
const SideBar = ({ currentPage, pages }: { currentPage: SideBarProps; pages: SideBarProps[] }) => {
  const { showPageSideBar } = useBuilderState();
  const [currentTab, setCurrentTab] = useState<'settings' | 'pages'>('settings');
  const [selectedPage, setSelectedPage] = useState<SideBarProps>();
  const { toast } = useToast();
  const [error, setError] = useState<ToasterProps>();
  const [search, setSearch] = useState<string>('');
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

  async function handleUpdatePageSettings(formData: FormData) {
    let name = (formData.get('name') as string) || null;
    let slug = (formData.get('slug') as string) || null;
    let metaTitle = (formData.get('metaTitle') as string) || null;
    let metaKeyWords = (formData.get('metaKeyWords') as string) || null;
    let metaDescription = (formData.get('metaDescription') as string) || null;
    let id = (formData.get('id') as string) || null;

    if (name && slug && id) {
      if (slug?.charAt(0) != '/') {
        setError({ title: 'Failed', description: 'slug name should start with /', type: 'destructive' });
        return;
      }
      let data = await updatePageSettings({ name, slug, metaTitle, metaKeyWords, metaDescription, id });
      if (data.error) {
        setError({ title: 'Failed', description: data.error, type: 'destructive' });
        return;
      }
      setError({ title: 'Success', description: 'Page settings updated', type: 'default' });
      router.replace(`/builder${data.data?.slug}` || '/');
    } else {
      setError({ title: 'Failed', description: 'Both page name and slug needed', type: 'destructive' });
    }
  }

  async function handleDeletePage() {
    let data = await deletePage({ id: selectedPage?.id || '' });
    if (data.error) {
      setError({ title: 'Failed', description: data.error, type: 'destructive' });
      return;
    }
    setError({ title: 'Success', description: 'Page settings updated', type: 'default' });
  }

  const debouncedInputChange = lodash.debounce((event) => {
    setSearch(event.target.value);
  }, 300);

  return (
    <div
      className={cn(
        'h-screen bg-gray-50 z-10  fixed w-[320px] pt-[60px] border-r left-[-330px]  border-r-slate-200 transition-all duration-300 ease-linear',
        {
          'left-0': showPageSideBar,
        },
      )}
    >
      <div className="bg-white w-full relative">
        <div className="flex">
          <div
            className={cn(
              'w-1/2 text-center border-b border-b-slate-100 text-slate-500 px-2 py-4 text-sm transition-colors duration-150 ease-linear cursor-pointer',
              {
                'text-black': currentTab === 'settings',
              },
            )}
            onClick={() => setCurrentTab('settings')}
          >
            Settings
          </div>
          <div
            className={cn(
              'w-1/2 text-center border-b border-b-slate-100 text-slate-500 px-2 py-4 text-sm transition-colors duration-150 ease-linear cursor-pointer',
              {
                'text-black': currentTab === 'pages',
              },
            )}
            onClick={() => setCurrentTab('pages')}
          >
            Pages
          </div>
        </div>
        <div
          className={cn('bg-brand-green-50 h-[2px] w-1/2 absolute transition-all duration-200 ease-in-out bottom-0', {
            'translate-x-full': currentTab === 'pages',
          })}
        />
      </div>

      <div className={cn('overflow-hidden h-full')}>
        <div
          className={cn('flex h-full w-[640px]  transition-all duration-300', {
            '-translate-x-1/2': currentTab === 'pages',
          })}
        >
          <form
            action={handleUpdatePageSettings}
            className={'w-[320px] flex-grow-0 flex-shrink-0 flex flex-col gap-4 py-3 px-2'}
          >
            <div className="w-full">
              <Label htmlFor="pageName" className="text-xs font-medium">
                Page Name
              </Label>
              <Input
                id="pageName"
                defaultValue={currentPage.name}
                name="name"
                type="text"
                placeholder="eg. Home page"
                className="w-full mt-1"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="slug" className="text-xs font-medium">
                Slug
              </Label>
              <Input
                id="slug"
                defaultValue={currentPage.slug}
                name="slug"
                type="text"
                placeholder="eg. /my-home-page"
                className="w-full mt-1"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="metaTitle" className="text-xs font-medium">
                Meta title
              </Label>
              <Input
                id="metaTitle"
                defaultValue={currentPage.metaTitle || ''}
                name="metaTitle"
                type="text"
                placeholder="eg. Home of electrical appliances"
                className="w-full mt-1"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="metaKeyWords" className="text-xs font-medium">
                Meta keywords
              </Label>
              <Input
                id="metaKeyWords"
                defaultValue={currentPage.metaKeyWords || ''}
                name="metaKeyWords"
                type="text"
                placeholder="eg. furnitures, home decor, appliances, real estate"
                className="w-full mt-1"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="metaDescription" className="text-xs font-medium">
                Meta description
              </Label>
              <Textarea
                id="metaDescription"
                defaultValue={currentPage.metaDescription || ''}
                name="metaDescription"
                placeholder="eg. We deal in quality home appliances...."
                className="w-full mt-1"
              />
            </div>

            <input type="hidden" name="id" defaultValue={currentPage.id} />
            <SubmitButton title="Save changes" loadingTitle="Saving..." />
          </form>

          <div className={'w-[320px] flex-grow-0 flex-shrink-0  flex flex-col gap-4 py-3 px-2'}>
            <div className="w-full">
              <Input
                id="search"
                name="search"
                type="text"
                placeholder="Search page"
                className="w-full mt-1"
                onChange={(event) => debouncedInputChange(event)}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{search.length ? 'Search results' : 'All pages'}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'}>
                    <PlusIcon size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <h3 className="text-bold mb-3">Add a new page</h3>
                  <CreatePage />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              {pages
                .filter((page) => page.name.toLowerCase().includes(search.toLowerCase()))
                .map((page) => (
                  <div
                    key={page.id}
                    className={cn(
                      'flex group items-center hover:bg-slate-50 transition-colors duration-200 ease-linear justify-between rounded-md  px-2 cursor-pointer',
                      {
                        '!bg-slate-100': currentPage.id === page.id,
                      },
                    )}
                  >
                    <div
                      onClick={() => {
                        router.replace(`/builder${page.slug}`);
                      }}
                      className="w-[45%] "
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center ">
                              <Dot className="text-brand-green-50 flex-shrink-0" size={50} />
                              <div className="w-full">
                                <h4
                                  className={cn('text-sm truncate font-medium', {
                                    'text-brand-green-50': currentPage.id === page.id,
                                  })}
                                >
                                  {page.name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{page.slug}</p>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent align="start">
                            <p>{page.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div
                      className={cn('gap-1 hidden group-hover:flex', {
                        '!flex': currentPage.id === page.id,
                      })}
                    >
                      <Button variant={'outline'} className="!bg-white">
                        <CopyIcon size={17} />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger
                          onClick={() => {
                            setSelectedPage(page);
                          }}
                          asChild
                        >
                          <Button variant={'outline'} className="!bg-white">
                            <Trash2 size={17} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the page{' '}
                              <b>{selectedPage?.name}</b>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeletePage}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SideBar;
