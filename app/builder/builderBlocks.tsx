'use client';

import registeredBlocks from '@/components/blocks/blocks_registery';

import { BuilderSectionsLayout } from 'visio-cms';

const BuilderBlocks = ({ slug, apiKey, projectId }: { slug: string; apiKey: string; projectId: string }) => {
  return (
    <BuilderSectionsLayout slug={slug} registeredBlocks={registeredBlocks} apiKey={apiKey} projectId={projectId} />
  );
};
export default BuilderBlocks;
