'use client';
import registeredBlocks from '@/components/blocks/blocks_registery';
import { JWTPayload } from 'jose';
import { RenderPageContent, EditPageButton, type PageBlock, type GlobalBlock } from 'visio-cms';

const RenderPage = ({
  data,
  isValidToken,
  slug,
}: {
  data: PageBlock[] | GlobalBlock[];
  isValidToken: JWTPayload | null;
  slug: string;
}) => {
  return (
    <>
      {isValidToken && <EditPageButton slug={slug} />}
      <RenderPageContent data={data} registeredBlocks={registeredBlocks} />
    </>
  );
};

export default RenderPage;
