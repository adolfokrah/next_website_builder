'use client';

import registeredBlocks from '@/components/blocks/blocks_registery';

import { GlobalBlock } from '@prisma/client';

import { BuilderSectionsLayout, type PageBlock } from 'visio-cms';

const BuilderBlocks = ({
  blocks,
  slug,
  globals,
}: {
  blocks: PageBlock[];
  slug: string;
  globals: GlobalBlock[] | [];
}) => {
  return (
    <BuilderSectionsLayout
      blocks={blocks}
      slug={slug}
      globals={JSON.parse(JSON.stringify(globals))}
      registeredBlocks={registeredBlocks}
    />
  );
};
export default BuilderBlocks;
