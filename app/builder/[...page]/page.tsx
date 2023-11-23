import VisioBuilderPage from './visioBuilderPage';

interface PageProps {
  params: {
    page: string[];
  };
}
const Page = async (props: PageProps) => {
  let slug = `/${props.params.page.join('/')}`;

  let res = await fetch(`${process.env.VISIO_END_POINT}/api/pages/${slug}/builder`, {
    next: { revalidate: 0 },
    method: 'GET',
  });

  let data = await res.json();

  return <VisioBuilderPage page={data.page || undefined} slug={slug} admin={data.admin} pages={data.pages} />;
};

export default Page;
