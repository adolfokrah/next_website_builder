import VisioBuilderPage from './visioBuilderPage';

interface PageProps {
  params: {
    page: string[];
  };
}
const Page = async (props: PageProps) => {
  let slug = `/${props.params.page.join('/')}`;

  return (
    <VisioBuilderPage
      slug={slug}
      projectId={process.env.NEXT_PUBLIC_PROJECT_ID || ''}
      apiKey={process.env.API_KEY || ''}
    />
  );
};

export default Page;
