'use client';
import { ChevronDown, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '../button';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';

const NavBar = ({ pageName }: { pageName: string }) => {
  const { showPageSideBar, viewPort, setViewPort, togglePageSideBar } = useBuilderState();

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
        <Button className=" text-white">Save & Publish</Button>
      </div>
    </div>
  );
};

export default NavBar;
