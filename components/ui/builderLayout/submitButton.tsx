import { useFormStatus } from 'react-dom';
import { Button } from '../button';
import { Loader2 } from 'lucide-react';

const SubmitButton = ({ title, loadingTitle }: { title: string; loadingTitle: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" size={'sm'} disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? loadingTitle : title}
    </Button>
  );
};

export default SubmitButton;
