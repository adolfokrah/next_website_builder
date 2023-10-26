'use client';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { Button } from '../button';
import Link from 'next/link';

type NavBarProps = {
  handleSaveChanges: () => void;
  page: string;
};

const NavBar = ({ handleSaveChanges, page }: NavBarProps) => {
  return (
    <div className="p-2 border-b w-full left-0 bg-white border-b-slate-200 fixed top-0 flex justify-end">
      <Button className="bg-sky-500 hover:bg-sky-700 text-white" onClick={handleSaveChanges}>
        Save & Publish
      </Button>

      <Link href={page} target="_blank">
        <Button variant={'outline'} className="ml-2">
          Preview
          <ExternalLinkIcon className="ml-2" />
        </Button>
      </Link>
    </div>
  );
};

export default NavBar;
