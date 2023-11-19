import NavBar from '@/builderComponents/ui/builderLayout/navbar';
import prisma from '@/lib/prisma_init';
import CreateNewPage from './createNewPage';
import SideBar from '@/builderComponents/ui/builderLayout/sideBar';
import ControllersSideBar from '@/builderComponents/ui/builderLayout/controllersSideBar';
import { EdgeStoreProvider } from '@/lib/edgestore';
import dynamic from 'next/dynamic';
import { Toaster } from '@/builderComponents/ui/toaster';
const VisioBuilder = dynamic(() => import('@/builderComponents/ui/builderLayout/visioBuilder'), { ssr: false }); //<- set SSr to false
import { cookies } from 'next/headers';
import { AdminUser } from '@prisma/client';
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

  if (!page) {
    return <CreateNewPage slug={slug} />;
  }

  let admin: AdminUser | undefined;
  if (token) {
    const { email } = JSON.parse(Buffer.from(token.value.split('.')[1], 'base64').toString());

    let user = await prisma.adminUser.findFirst({
      where: { email },
    });
    if (user) {
      admin = user;
    }
  }

  return (
    <EdgeStoreProvider>
      <div>
        <NavBar pageName={page.name} slug={slug} admin={admin} />
        <div className="flex justify-end">
          <SideBar currentPage={page} pages={pages} />
          <VisioBuilder slug={slug} />
          <ControllersSideBar />
          <Toaster />
        </div>
      </div>
    </EdgeStoreProvider>
  );
};

export default Page;
