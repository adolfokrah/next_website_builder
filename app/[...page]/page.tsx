import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import RenderPage from './renderPage';

interface PageProps {
  params: {
    page: string[];
  };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const slug = `${props.params.page.join('/')}`;
  let res = await fetch(`${process.env.VISIO_END_POINT}/api/pages/${slug}/meta`, {
    next: { revalidate: 0 },
    method: 'GET',
  });
  const meta = await res.json();
  return meta;
}

export default async function Page(props: PageProps) {
  const slug = `${props.params.page.join('/')}`;
  let res = await fetch(`${process.env.VISIO_END_POINT}/api/pages/${slug}`, {
    next: { revalidate: 0 },
    method: 'GET',
  });

  const data = await res.json();

  if (data.error != null) {
    redirect('/404');
  }
  const pageData = data.page;

  return <RenderPage data={pageData?.blocks || []} slug={slug} isValidToken={pageData.isValidToken} />;
}
