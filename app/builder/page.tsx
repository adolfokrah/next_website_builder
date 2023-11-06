import prisma from '@/lib/prisma_init';
import BuilderBlocks from './preview';

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

  return <BuilderBlocks blocks={page?.blocks as object[]} />;
};

export default PreviewPage;
