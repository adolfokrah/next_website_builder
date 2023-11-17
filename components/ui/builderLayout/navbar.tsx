'use client';
import { ChevronDown, ExternalLink, Loader2, Monitor, Redo, Redo2, Smartphone, Tablet, Undo2 } from 'lucide-react';
import { Button } from '../button';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { savePage } from '@/lib/actions/pageActions';
import { useToast } from '../use-toast';
import { useEffect, useState } from 'react';
import { PageBlock, ToasterProps } from '@/lib/types';
import { PageStatus } from '@prisma/client';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePageBlocksState } from '@/lib/usePageBlockState';
import { UserButton } from '@clerk/nextjs';

const NavBar = ({ pageName, slug }: { pageName: string; slug: string }) => {
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

  const [history, setHistory] = useState<PageBlock[][]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const canUndo: boolean = currentPosition > 0;
  const canRedo: boolean = currentPosition < history.length - 1;

  const updateHistory = (newState: PageBlock[]): void => {
    setHistory((prevHistory) => {
      const clonedHistory = structuredClone(prevHistory).slice(0, currentPosition + 1);
      clonedHistory.push(newState);
      setCurrentPosition(clonedHistory.length);
      setPageBlocks(newState);
      return clonedHistory;
    });
  };

  const undo = (): void => {
    if (canUndo) {
      setCurrentPosition(currentPosition - 1);
      setPageBlocks([...history[currentPosition - 1]]);
    }
  };

  const redo = (): void => {
    if (canRedo) {
      setCurrentPosition(currentPosition + 1);
      setPageBlocks([...history[currentPosition + 1]]);
    }
  };

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState<ToasterProps>();

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
          <UserButton afterSignOutUrl="/builder/sign-in" />
          <div>
            <Button variant={'ghost'}>
              <Undo2 size={17} className="text-white" />
            </Button>
            <Button variant={'ghost'}>
              <Redo2 size={17} className="text-white" />
            </Button>
          </div>
          {buildStatus == 'saved' ? (
            <Link href={`${slug}`} target="_blank">
              <Button className=" text-white" variant={'ghost'}>
                Preview
                <ExternalLink size={17} className="ml-2" />
              </Button>
            </Link>
          ) : (
            <Button className=" text-white" variant={'ghost'} disabled={true}>
              Preview
              <ExternalLink size={17} className="ml-2" />
            </Button>
          )}

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
