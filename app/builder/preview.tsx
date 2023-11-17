'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, ChevronUp, Trash2, Copy, FileWarning } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BlocksCommandPallet from '@/components/ui/builderLayout/blocksCommandPallet';
import registerBlocks from '@/lib/blocks_registery';
import { PageBlock } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { v4 as uuidv4 } from 'uuid';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';

import { GlobalBlock } from '@prisma/client';
import AddRemoveBlockAlert from '@/components/ui/builderLayout/addRemoveBlockAlert';
import useBuilder from '@/lib/hooks/useBuilder';

const BuilderBlocks = ({
  blocks,
  slug,
  globals,
}: {
  blocks: PageBlock[];
  slug: string;
  globals: GlobalBlock[] | [];
}) => {
  const {
    pageBlocks,
    open,
    insertBlockAbove,
    globalBlockInputName,
    alertStatus,
    handleRemoveSelectedBlocks,
    handleMoveBlock,
    handleDuplicateBlock,
    handleDeleteSection,
    handleSaveGlobalBlock,
    handleRemoveGlobalBlock,
    handleCopyBlock,
    handlePasteBlock,
    setPageBlocks,
    setOpen,
    setInsertBlockAbove,
    setGlobalBlockInputName,
    updateHistory,
    setAlertStatus,
  } = useBuilder(blocks, slug);

  //   if (!build) return null;

  if (!pageBlocks.length) {
    return (
      <div>
        <TooltipProvider>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="w-full h-screen grid place-items-center">
                <div className=" w-[90%] md:w-1/2 p-[120px] rounded-2xl border grid place-items-center border-slate-200">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="rounded-full w-14 h-14 p-0" onClick={() => setOpen(true)}>
                          <Plus size={20} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="center">
                        <p>Add a block</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                Add a block
              </ContextMenuItem>

              {typeof window !== 'undefined' && localStorage.getItem('copiedBlock') && (
                <>
                  <ContextMenuItem className="cursor-pointer" onClick={() => handlePasteBlock(0, 'above')}>
                    Paste block here
                    <ContextMenuShortcut>{`⌘V`}</ContextMenuShortcut>
                  </ContextMenuItem>
                </>
              )}
            </ContextMenuContent>
          </ContextMenu>
        </TooltipProvider>
        <BlocksCommandPallet
          open={open}
          globals={globals}
          setOpen={setOpen}
          addPageBlock={(block) => {
            handleRemoveSelectedBlocks();
            setPageBlocks((prevState) => {
              let data = [...prevState, block];
              updateHistory(data);
              return [...data];
            });
          }}
        />
      </div>
    );
  }
  return (
    <div className="mt-[40px] builder">
      <AddRemoveBlockAlert
        alertStatus={alertStatus}
        setAlertStatus={(open) => setAlertStatus((prevState) => ({ ...prevState, open }))}
        handleRemoveGlobalBlock={handleRemoveGlobalBlock}
        globalBlockInputName={globalBlockInputName}
        setGlobalBlockInputName={setGlobalBlockInputName}
        handleSaveGlobalBlock={handleSaveGlobalBlock}
      />
      <BlocksCommandPallet
        open={open}
        setOpen={setOpen}
        globals={globals}
        addPageBlock={(block) => {
          handleRemoveSelectedBlocks();
          setPageBlocks((prevState) => {
            const newData = Array.from(prevState);
            if (insertBlockAbove) {
              if (insertBlockAbove?.position === 'top') {
                newData.splice(insertBlockAbove.index, 0, block);
              } else {
                newData.splice(insertBlockAbove.index + 1, 0, block);
              }
            }
            updateHistory(newData);
            return [...newData];
          });
        }}
      />
      {pageBlocks.map((block, index) => {
        const foundBlock = registerBlocks.find((rBlock) => rBlock.key === block.key);
        const inputs = block.inputs;
        if (foundBlock) {
          let Tag = foundBlock.component;
          let selected = block.selected;
          return (
            <section key={uuidv4()} className="relative">
              <TooltipProvider>
                <ContextMenu>
                  <ContextMenuTrigger asChild disabled={!selected}>
                    <div>
                      <div
                        className={cn(
                          'absolute z-20 px-1 top-[-30px] justify-between items-center left-0 hidden gap-1 w-full',
                          {
                            flex: selected,
                          },
                        )}
                      >
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className={cn('w-6 h-6 p-0', {
                                  'bg-blue-400 hover:bg-blue-600': block.globalId,
                                })}
                                onClick={() => handleMoveBlock('bottom', index)}
                                disabled={index == pageBlocks.length - 1}
                              >
                                <ChevronDown size={17} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center">
                              <p>Move Down</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className={cn('w-6 h-6 p-0', {
                                  'bg-blue-400 hover:bg-blue-600': block.globalId,
                                })}
                                onClick={() => handleMoveBlock('up', index)}
                                disabled={index == 0}
                              >
                                <ChevronUp size={17} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center">
                              <p>Move Up</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className={cn('w-6 h-6 p-0', {
                                'bg-blue-400 hover:bg-blue-600': block.globalId,
                              })}
                              onClick={() => {
                                setInsertBlockAbove({
                                  position: 'top',
                                  index,
                                });
                                setOpen(true);
                              }}
                            >
                              <Plus size={17} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent align="center">
                            <p>Add new block above</p>
                          </TooltipContent>
                        </Tooltip>

                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className={cn('w-6 h-6 p-0', {
                                  'bg-blue-400 hover:bg-blue-600': block.globalId,
                                })}
                                onClick={() => handleDuplicateBlock(index)}
                              >
                                <Copy size={17} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center">
                              <p>Duplicate block</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className={cn('w-6 h-6 p-0', {
                                  'bg-blue-400 hover:bg-blue-600': block.globalId,
                                })}
                                onClick={() => handleDeleteSection(index)}
                              >
                                <Trash2 size={17} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center">
                              <p>Delete block</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div
                        className={cn('border-transparent hover:border-[1px]  hover:border-brand-green-50', {
                          'border-brand-green-50 border-[2px]': selected,
                          ' hover:border-blue-400': block.globalId,
                          'border-blue-400': block.globalId && selected,
                        })}
                        onClick={() => {
                          if (selected) return;
                          setPageBlocks((prevBlocks) => {
                            let components = [...prevBlocks].map((c) => ({
                              ...c,
                              selected: false,
                            }));
                            components[index].selected = true;
                            updateHistory([...components]);
                            return [...components];
                          });
                        }}
                      >
                        <Tag {...inputs} />
                      </div>

                      <div
                        className={cn('absolute z-20 px-1 bottom-[-30px] hidden justify-center left-0  gap-1 w-full', {
                          flex: selected,
                        })}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className={cn('w-6 h-6 p-0', {
                                'bg-blue-400 hover:bg-blue-600': block.globalId,
                              })}
                              onClick={() => {
                                setInsertBlockAbove({
                                  position: 'bottom',
                                  index,
                                });
                                setOpen(true);
                              }}
                            >
                              <Plus size={17} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent align="center">
                            <p>Add new block below</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-64">
                    {!block.globalId && (
                      <ContextMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setAlertStatus((prevState) => ({
                            ...prevState,
                            open: true,
                            value: index,
                            action: 'insertGlobal',
                          }))
                        }
                      >
                        Save as global
                        <ContextMenuShortcut>{`⌘G`}</ContextMenuShortcut>
                      </ContextMenuItem>
                    )}

                    {block.globalId && (
                      <ContextMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setAlertStatus((prevState) => ({
                            ...prevState,
                            open: true,
                            value: block.globalId,
                            action: 'removeGlobal',
                          }))
                        }
                      >
                        Remove as global
                        <ContextMenuShortcut>{`⌘G`}</ContextMenuShortcut>
                      </ContextMenuItem>
                    )}

                    <ContextMenuItem className="cursor-pointer" onClick={() => handleDuplicateBlock(index)}>
                      Duplicate
                      <ContextMenuShortcut>{`⌘D`}</ContextMenuShortcut>
                    </ContextMenuItem>
                    {localStorage.getItem('copiedBlock') ? (
                      <>
                        <ContextMenuItem className="cursor-pointer" onClick={() => handlePasteBlock(index, 'above')}>
                          Paste block above
                          <ContextMenuShortcut>{`⌘V`}</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem className="cursor-pointer" onClick={() => handlePasteBlock(index, 'below')}>
                          Past block below
                          <ContextMenuShortcut>{`⌘V`}</ContextMenuShortcut>
                        </ContextMenuItem>
                      </>
                    ) : (
                      <ContextMenuItem className="cursor-pointer" onClick={() => handleCopyBlock(index)}>
                        Copy
                        <ContextMenuShortcut>{`⌘C`}</ContextMenuShortcut>
                      </ContextMenuItem>
                    )}
                    <ContextMenuItem className="cursor-pointer" onClick={() => handleDeleteSection(index)}>
                      Delete
                      <ContextMenuShortcut>{`⌘X`}</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </TooltipProvider>
            </section>
          );
        }
        return (
          <section key={block.id} className="w-full h-56 border border-slate-200 text-center grid place-items-center ">
            <div>
              <div className="flex gap-2  items-center justify-center">
                <Button className="rounded-full  p-0 w-12 h-12" variant={'outline'}>
                  <FileWarning className="text-red-400" size={20} />
                </Button>
                <Button
                  className="rounded-full  p-0 w-12 h-12"
                  variant={'outline'}
                  onClick={() => handleDeleteSection(index)}
                >
                  <Trash2 className="text-red-400" size={20} />
                </Button>
              </div>
              <p className="text-xs mt-2">{block.title} not found in blocks registry</p>
            </div>
          </section>
        );
      })}
      <Toaster />
    </div>
  );
};
export default BuilderBlocks;
