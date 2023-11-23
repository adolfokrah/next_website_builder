'use client';

import registeredBlocks from '@/components/blocks/blocks_registery';
import { Builder, type BuilderProps, NewPageCreation } from 'visio-cms';

const VisioBuilderPage = ({ page, slug, admin, pages }: Partial<BuilderProps>) => {
  if (!page) {
    return <NewPageCreation slug={slug || ''} />;
  }

  return (
    <Builder page={page} slug={slug || ''} admin={admin} pages={pages || []} registeredBlocks={registeredBlocks} />
  );
};

export default VisioBuilderPage;
