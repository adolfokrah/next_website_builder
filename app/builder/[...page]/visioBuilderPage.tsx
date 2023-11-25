'use client';

import registeredBlocks from '@/components/blocks/blocks_registery';
import { Builder, type BuilderProps } from 'visio-cms';

const VisioBuilderPage = ({ slug }: Partial<BuilderProps>) => {
  return <Builder slug={slug || ''} registeredBlocks={registeredBlocks} />;
};

export default VisioBuilderPage;
