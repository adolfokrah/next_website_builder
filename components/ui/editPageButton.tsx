import Link from 'next/link';
import { Button } from './button';
import { Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const EditPageButton = ({ slug }: { slug: string }) => {
  return (
    <Link href={`/builder/${slug}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="p-0 rounded-full h-[40px] w-[40px] fixed z-50  grid place-items-center right-3 bottom-7">
              <Pencil size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="start" asChild>
            <p>Edit page</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
};

export default EditPageButton;
