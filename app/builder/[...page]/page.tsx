import NavBar from '@/components/ui/builderLayout/navbar';
import VisioBuilder from '@/components/ui/builderLayout/visioBuilder';
import prisma from '@/lib/prisma_init';
import CreateNewPage from './createNewPage';
import SideBar from '@/components/ui/builderLayout/sideBar';
import ControllersSideBar from '@/components/ui/builderLayout/controllersSideBar';
import { EdgeStoreProvider } from '@/lib/edgestore';
interface PageProps {
  params: {
    page: string[];
  };
}
const Page = async (props: PageProps) => {
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

  return (
    <EdgeStoreProvider>
      <>
        <NavBar pageName={page.name} slug={slug} />
        <div className="flex justify-end">
          <SideBar currentPage={page} pages={pages} />
          <VisioBuilder slug={slug} />
          <ControllersSideBar />
        </div>
      </>
    </EdgeStoreProvider>
  );
};

export default Page;
