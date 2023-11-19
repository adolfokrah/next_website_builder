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
import registerBlocks from '@/components/blocks/blocks_registery';
import { v4 as uuidv4 } from 'uuid';
import { PageBlock } from '@/lib/types';
import { GlobalBlock } from '@prisma/client';
import { SquareCodeIcon } from 'lucide-react';
import { GlobalBlock as GlobalBlockProp } from '@/lib/types';
const BlocksCommandPallet = ({
  open,
  setOpen,
  addPageBlock,
  globals,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addPageBlock: (block: PageBlock) => void;
  globals: GlobalBlock[] | [];
}) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a block..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {globals && (
          <CommandGroup heading="Global blocks">
            {globals.map((global) => {
              let globalBlock = global.block as GlobalBlockProp;
              let block = registerBlocks.find((rBlock) => rBlock.key === globalBlock.key) as PageBlock;
              if (block) {
                return (
                  <CommandItem
                    key={global.id}
                    className="cursor-pointer"
                    onSelect={() => {
                      setOpen(false);
                      addPageBlock({
                        ...block,
                        id: uuidv4(),
                        inputs: globalBlock.inputs,
                        selected: true,
                        globalId: global.id,
                      });
                    }}
                  >
                    <span className="mr-2">
                      <SquareCodeIcon />
                    </span>
                    <span>{global.name} [G]</span>
                  </CommandItem>
                );
              }
              return null;
            })}
          </CommandGroup>
        )}
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
