'use client';
import Builder from '@/components/ui/builderLayout/builder';
import registeredComponents from '@/lib/component_registery';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();
interface PageProps {
  params: {
    page: string[];
  };
}
const Page = (props: PageProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Builder registeredComponents={registeredComponents} page={props.params.page} />
    </QueryClientProvider>
  );
};

export default Page;
