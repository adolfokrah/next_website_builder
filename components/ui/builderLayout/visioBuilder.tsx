'use client';

import { PageBlock } from '@/lib/types';
import { useBuilderState } from '@/lib/useBuilderState';
import { usePageBlocksState } from '@/lib/usePageBlockState';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type BuilderProps = {
  slug: string;
};

const VisioBuilder = ({ slug }: BuilderProps) => {
  let targetOrigin = '';
  if (typeof window !== 'undefined') {
    targetOrigin = `${window.location.protocol}//${window.location.host}`;
  }
  const { viewPort, messageToIframe, setMessageToIframe } = useBuilderState((state) => ({
    viewPort: state.viewPort,
    messageToIframe: state.messageToIframe,
    setMessageToIframe: state.setMessageToIframe,
  }));

  const setPageBlocks = usePageBlocksState((state) => state.setPageBlocks);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const postMessageToIframe = () => {
    if (iframeRef.current) {
      const message = messageToIframe;
      iframeRef.current.contentWindow?.postMessage(message, targetOrigin);
    }
  };

  useEffect(() => {
    postMessageToIframe();
  }, [messageToIframe]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== targetOrigin) return;

      try {
        let data = JSON.parse(event.data) as PageBlock[];
        setPageBlocks(data);
        const selectedBlock = data.find((block) => block.selected);
        if (!selectedBlock) setMessageToIframe('build');
      } catch (e) {}
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [targetOrigin]);

  return (
    <div className="relative bg-slate-50 pt-[65px] right-0 top-0 transition-all duration-300 ease-linear w-full">
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
