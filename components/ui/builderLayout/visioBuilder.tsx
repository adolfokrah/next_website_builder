'use client';

import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type BuilderProps = {
  slug: string;
};

const VisioBuilder = ({ slug }: BuilderProps) => {
  const { showPageSideBar, viewPort, setPageBlocks } = useBuilderState();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postMessageToIframe = () => {
    if (iframeRef.current) {
      const message = 'build';
      const targetOrigin = 'http://localhost:3000';
      iframeRef.current.contentWindow?.postMessage(message, targetOrigin);
    }
  };

  useEffect(() => {
    postMessageToIframe();
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3000') return;
      try {
        setPageBlocks(JSON.parse(event.data));
      } catch (e) {}
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return (
    <div
      className="relative bg-slate-50 pt-[65px] right-0 top-0 transition-all duration-300 ease-linear"
      style={{
        width: !showPageSideBar ? '100%' : 'calc(100% - 320px)',
      }}
    >
      <iframe
        ref={iframeRef}
        className={cn('w-[100%] transition-all  bg-white overflow-scroll duration-300 ease-linear  m-auto', {
          'w-[458px]': viewPort === 'Mobile',
          'w-[789px]': viewPort === 'Tablet',
        })}
        style={{
          height: 'calc(100vh - 65px)',
        }}
        src={`/builder?page=${slug}`}
      />
    </div>
  );
};

export default VisioBuilder;
