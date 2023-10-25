"use client";
import { Button } from "../button";

type NavBarProps = {
  handleSaveChanges: () => void;
};

const NavBar = ({ handleSaveChanges }: NavBarProps) => {
  return (
    <div className="p-2 border-b w-full left-0 bg-white border-b-slate-200 fixed top-0 flex justify-end">
      <Button
        className="bg-sky-500 hover:bg-sky-700 text-white"
        onClick={handleSaveChanges}
      >
        Save & Publish
      </Button>
    </div>
  );
};

export default NavBar;
