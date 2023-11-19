import prisma from '@/lib/prisma_init';

import BuilderBlocks from './preview';
import { getPageBlocks } from '@/lib/utils';

interface PageProps {
  searchParams: {
    page: string;
  };
}
const PreviewPage = async (props: PageProps) => {
  let page = await prisma.page.findFirst({
    where: {
      slug: props.searchParams.page,
    },
    select: {
      blocks: true,
    },
  });
  let globals = await prisma.globalBlock.findMany();

  //check if page block has an existing globalId
  if (page?.blocks) {
    page.blocks = (await getPageBlocks(JSON.parse(JSON.stringify(page.blocks)))) || page.blocks;
  }

  return (
    <BuilderBlocks
      blocks={JSON.parse(JSON.stringify(page?.blocks))}
      globals={globals || []}
      slug={props.searchParams.page}
    />
  );
};

export default PreviewPage;
