'use client';

import registeredBlocks from '@/components/blocks/blocks_registery';
import { Builder, type BuilderProps } from 'visio-cms';

const VisioBuilderPage = ({
  slug,
  apiKey,
  projectId,
}: Partial<BuilderProps> & {
  apiKey: string;
  projectId: string;
}) => {
  return <Builder slug={slug || ''} registeredBlocks={registeredBlocks} apiKey={apiKey} projectId={projectId} />;
};

export default VisioBuilderPage;
