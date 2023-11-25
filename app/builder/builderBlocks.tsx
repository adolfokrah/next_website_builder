'use client';

import registeredBlocks from '@/components/blocks/blocks_registery';

import { BuilderSectionsLayout } from 'visio-cms';

const BuilderBlocks = ({ slug }: { slug: string }) => {
  return <BuilderSectionsLayout slug={slug} registeredBlocks={registeredBlocks} />;
};
export default BuilderBlocks;
