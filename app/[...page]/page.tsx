import RenderBuilderContent from '@/components/ui/builderLayout/renderBuilderContent';
import { PageStatus, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
interface PageProps {
  params: {
    page: string[];
  };
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  let data = await prisma.page.findFirst({
    where: {
      slug: `/${props.params.page.join('/')}`,
    },
    select: {
      metaTitle: true,
      metaDescription: true,
      metaKeyWords: true,
      name: true,
    },
  });
  prisma.$disconnect();

  return {
    title: data?.name,
    description: data?.metaDescription,
    keywords: data?.metaKeyWords,
  };
}

export default async function Page(props: PageProps) {
  let page = await prisma.page.findFirst({
    where: {
      slug: `/${props.params.page.join('/')}`,
    },
  });
  prisma.$disconnect();

  if (page?.status !== PageStatus.PUBLISHED) {
    redirect('/404');
  }
  return (
    <>
      <RenderBuilderContent data={page?.blocks || []} />
    </>
  );
}
