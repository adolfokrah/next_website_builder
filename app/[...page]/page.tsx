import RenderBuilderContent from '@/components/ui/builderLayout/renderBuilderContent';
import { getPageBlocks } from '@/lib/utils';
import { PageStatus } from '@prisma/client';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/auth';
import EditPageButton from '@/components/ui/editPageButton';
import prisma from '@/lib/prisma_init';
interface PageProps {
  params: {
    page: string[];
  };
}

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
  const slug = `/${props.params.page.join('/')}`;

  let page = await prisma.page.findFirst({
    where: {
      slug: slug,
    },
    select: {
      blocks: true,
      status: true,
    },
  });
  prisma.$disconnect();

  if (page?.status !== PageStatus.PUBLISHED) {
    redirect('/404');
  }

  if (page?.blocks) {
    page.blocks = (await getPageBlocks(JSON.parse(JSON.stringify(page.blocks)))) || page.blocks;
  }

  const cookieStore = cookies();
  const { value: token } = cookieStore.get('token') ?? { value: '' };
  let isValidToken = await verifyJwtToken(token);

  return (
    <>
      {isValidToken && <EditPageButton slug={slug} />}
      <RenderBuilderContent data={page?.blocks || []} />
    </>
  );
}
