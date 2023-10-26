import RenderBuilderContent from '@/components/ui/builderLayout/renderBuilderContent';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface PageProps {
  params: {
    page: string[];
  };
}

export default async function Page(props: PageProps) {
  let data = await prisma.page.findFirst({
    where: {
      name: `/${props.params.page.join('/')}`,
    },
  });
  prisma.$disconnect();
  return (
    <>
      <RenderBuilderContent data={data?.components || ''} />
    </>
  );
}
