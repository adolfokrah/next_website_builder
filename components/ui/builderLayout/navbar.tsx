'use client';
import { ChevronDown, ExternalLink, Loader2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '../button';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { savePage } from '@/lib/actions/pageActions';
import { useToast } from '../use-toast';
import { useEffect, useState } from 'react';
import { ToasterProps } from '@/lib/types';

const NavBar = ({ pageName }: { pageName: string }) => {
  const { pageBlocks, viewPort, pageId, setViewPort, togglePageSideBar } = useBuilderState();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ToasterProps>();
  useEffect(() => {
    if (error) {
      toast({
        title: error?.title,
        description: error?.description,
        variant: error?.type,
      });
    }
  }, [error, toast]);

  async function handleSaveAndPublishPage() {
    setLoading(true);
    let data = await savePage({ blocks: pageBlocks, id: pageId });
    setLoading(false);
    if (data.error) {
      setError({ title: 'Failed', description: data.error, type: 'destructive' });
      return;
    }
    setError({ title: 'Success', description: 'Page saved and published', type: 'default' });
  }

  return (
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
        <Button className=" text-white" variant={'ghost'}>
          Preview
          <ExternalLink size={17} className="ml-2" />
        </Button>
        <Button className=" text-white" onClick={handleSaveAndPublishPage}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {'Saving...'}
            </>
          ) : (
            'Save & Publish'
          )}
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
