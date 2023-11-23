import prisma from '@/lib/prisma_init';
import { cookies } from 'next/headers';
import VisioBuilderPage from './visioBuilderPage';
import registeredBlocks from '@/components/blocks/blocks_registery';

interface PageProps {
  params: {
    page: string[];
  };
}
const Page = async (props: PageProps) => {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  let slug = `/${props.params.page.join('/')}`;

  let page = await prisma.page.findFirst({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      metaDescription: true,
      metaTitle: true,
      metaKeyWords: true,
      featuredImage: true,
    },
  });

  let pages = await prisma.page.findMany({
    select: { name: true, slug: true, id: true, status: true },
  });

  let admin;
  if (token) {
    const { email } = JSON.parse(Buffer.from(token.value.split('.')[1], 'base64').toString());

    let user = await prisma.adminUser.findFirst({
      where: { email },
    });
    if (user) {
      admin = JSON.parse(JSON.stringify(user));
    }
  }

  return <VisioBuilderPage page={page || undefined} slug={slug} admin={admin} pages={pages} />;
};

export default Page;
