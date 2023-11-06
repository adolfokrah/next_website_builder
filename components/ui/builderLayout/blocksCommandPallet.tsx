import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import registerBlocks from '@/lib/blocks_registery';
import { v4 as uuidv4 } from 'uuid';
import { PageBlock } from '@/lib/types';

const BlocksCommandPallet = ({
  open,
  setOpen,
  addPageBlock,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addPageBlock: (block: PageBlock) => void;
}) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a block..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Blocks">
          {registerBlocks.map((block) => (
            <CommandItem
              key={block.title}
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                addPageBlock({ ...block, id: uuidv4(), inputs: block.defaultInputs, selected: true });
              }}
            >
              <span className="mr-2">{block.icon}</span>
              <span>{block.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default BlocksCommandPallet;
