'use client';
import { ChevronDown, ExternalLink, Loader2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '../button';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { savePage } from '@/lib/actions/pageActions';
import { useToast } from '../use-toast';
import { useEffect, useState } from 'react';
import { ToasterProps } from '@/lib/types';
import { AdminUser, PageStatus } from '@prisma/client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { usePageBlocksState } from '@/lib/usePageBlockState';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavBar = ({ pageName, slug, admin }: { pageName: string; slug: string; admin: AdminUser | undefined }) => {
  const { viewPort, pageId, setViewPort, togglePageSideBar, buildStatus, setBuildStatus } = useBuilderState(
    (state) => ({
      viewPort: state.viewPort,
      pageId: state.pageId,
      setViewPort: state.setViewPort,
      togglePageSideBar: state.togglePageSideBar,
      buildStatus: state.buildStatus,
      setBuildStatus: state.setBuildStatus,
    }),
  );

  const { pageBlocks, setPageBlocks } = usePageBlocksState((state) => ({
    setPageBlocks: state.setPageBlocks,
    pageBlocks: state.pageBlocks,
  }));

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState<ToasterProps>();
  const router = useRouter();

  useEffect(() => {
    if (toastProps) {
      toast({
        title: toastProps?.title,
        description: toastProps?.description,
        variant: toastProps?.type,
      });
    }
  }, [toastProps, toast]);

  useEffect(() => {
    setBuildStatus('unSaved');
  }, [pageBlocks]);

  async function handleSaveAndPublishPage(status: PageStatus) {
    setLoading(true);
    let data = await savePage({ blocks: pageBlocks, id: pageId, status });
    setLoading(false);
    setBuildStatus('saved');
    if (data.error) {
      setToastProps({ title: 'Failed', description: data.error, type: 'destructive' });
      return;
    }
    setToastProps({ title: 'Success', description: 'Page saved and published', type: 'default' });
  }

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ email: 'd', password: 'd' }),
    });

    const data = await res.json();
    if (data.success) {
      router.replace('/builder/sign-in');
    }
  };

  return (
    <>
      <div className=" p-4 border-b w-full left-0 z-20 bg-brand-dark-blue border-b-slate-200 fixed top-0 flex justify-between">
        <Button className="bg-transparent hover:bg-transparent" onClick={togglePageSideBar}>
          <ChevronDown className="mr-2 " size="20" />
          {pageName}
        </Button>
        <div className="flex  items-center">
          <Button
            className={cn('bg-transparent hover:bg-slate-700', {
              '!bg-brand-green-50': viewPort == 'Desktop',
            })}
            onClick={() => setViewPort('Desktop')}
          >
            <Monitor size={20} />
          </Button>
          <Button
            className={cn('bg-transparent hover:bg-slate-700', {
              '!bg-brand-green-50': viewPort == 'Tablet',
            })}
            onClick={() => setViewPort('Tablet')}
          >
            <Tablet size={20} />
          </Button>
          <Button
            className={cn('bg-transparent hover:bg-slate-700', {
              '!bg-brand-green-50': viewPort == 'Mobile',
            })}
            onClick={() => setViewPort('Mobile')}
          >
            <Smartphone size={20} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={admin?.avatar || ''} />
                <AvatarFallback>{admin?.email.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={`${slug}`} target="_blank">
            <Button className=" text-white" variant={'ghost'}>
              Preview
              <ExternalLink size={17} className="ml-2" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className=" text-white" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {'Saving...'}
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  handleSaveAndPublishPage(PageStatus.DRAFT);
                }}
              >
                Save as draft
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  handleSaveAndPublishPage(PageStatus.PUBLISHED);
                }}
              >
                Save and publish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default NavBar;
