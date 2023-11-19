import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/builderComponents/ui/card';
import CreatePage from '@/builderComponents/ui/builderLayout/createPage';

const CreateNewPage = ({ slug }: { slug: string }) => {
  return (
    <div className="w-full h-screen grid place-items-center bg-slate-50">
      <Card>
        <CardHeader>
          <CardTitle>Create new page</CardTitle>
          <CardDescription>The page you want to edit does not exist. Do you want to create it?</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePage slug={slug} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNewPage;
