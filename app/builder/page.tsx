import BuilderBlocks from './builderBlocks';

interface PageProps {
  searchParams: {
    page: string;
  };
}
const PreviewPage = async (props: PageProps) => {
  let slug = `${props.searchParams.page}`;

  let res = await fetch(`${process.env.VISIO_END_POINT}/api/pages/${slug}/blocks`, {
    next: { revalidate: 0 },
    method: 'GET',
  });

  let data = await res.json();

  return <BuilderBlocks blocks={data.page?.blocks} globals={data.globals || []} slug={props.searchParams.page} />;
};

export default PreviewPage;
