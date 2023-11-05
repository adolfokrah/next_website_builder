'use client';
import Frame, { FrameContextConsumer } from 'react-frame-component';

import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';

type BuilderProps = {
  slug: string[];
};

const VisioBuilder = ({ slug }: BuilderProps) => {
  const { showPageSideBar, viewPort } = useBuilderState();
  return (
    <div
      className="relative bg-slate-50 pt-[60px] right-0 top-0 transition-all duration-300 ease-linear"
      style={{
        width: !showPageSideBar ? '100%' : 'calc(100% - 320px)',
      }}
    >
      <Frame
        className={cn('w-[100%] transition-all  overflow-scroll duration-300 ease-linear  m-auto', {
          'w-[458px]': viewPort === 'Mobile',
          'w-[789px]': viewPort === 'Tablet',
        })}
        style={{
          height: 'calc(100vh - 60px)',
        }}
      >
        <div className="text-4xl">hello world</div>
        <div className="text-4xl">hello world</div>
        <div className="text-4xl">hello world</div>
        <div className="text-4xl">hello world</div>
        <div className="text-4xl">hello world</div>
        <div className="text-4xl">hello world</div>
      </Frame>
    </div>
  );
};

export default VisioBuilder;
