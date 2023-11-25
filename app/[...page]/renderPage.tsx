'use client';
import registeredBlocks from '@/components/blocks/blocks_registery';
import { JWTPayload } from 'jose';
import { RenderPageContent, EditPageButton, type PageBlock, type GlobalBlock } from 'visio-cms';

const RenderPage = ({
  data,
  isValidToken,
  slug,
  projectId,
}: {
  data: PageBlock[] | GlobalBlock[];
  isValidToken: JWTPayload | null;
  slug: string;
  projectId: string;
}) => {
  return (
    <>
      {isValidToken && <EditPageButton slug={slug} />}
      <RenderPageContent data={data} registeredBlocks={registeredBlocks} projectId={projectId} />
    </>
  );
};

export default RenderPage;
