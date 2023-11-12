'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, ChevronUp, Trash2, Copy, FileWarning } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BlocksCommandPallet from '@/components/ui/builderLayout/blocksCommandPallet';
import registerBlocks from '@/lib/blocks_registery';
import { BlockProps, PageBlock } from '@/lib/types';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Toaster } from '@/components/ui/toaster';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';
import { insertGlobalBlock, removeGlobalBlock } from '@/lib/actions/blockActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ToasterProps } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { GlobalBlock } from '@prisma/client';

type insertBlockAboveT = {
  position: 'top' | 'bottom';
  index: number;
};
const BuilderBlocks = ({
  blocks,
  slug,
  globals,
}: {
  blocks: PageBlock[];
  slug: string;
  globals: GlobalBlock[] | [];
}) => {
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);
  const [build, setBuild] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [insertBlockAbove, setInsertBlockAbove] = useState<insertBlockAboveT>();
  const [toastProps, setToastProps] = useState<ToasterProps | null>();
  const { toast } = useToast();
  const [globalBlockInputName, setGlobalBlockInputName] = useState('');
  const [alertStatus, setAlertStatus] = useState<{
    open: boolean;
    action: 'insertGlobal' | 'removeGlobal';
    value?: number | string | undefined;
  }>({
    open: false,
    action: 'insertGlobal',
  });

  useEffect(() => {
    if (toast) {
      toast({
        title: toastProps?.title,
        description: toastProps?.description,
        variant: toastProps?.type,
      });
    }
  }, [toastProps]);

  useEffect(() => {
    setPageBlocks((prevState) => {
      if (prevState.length) {
        return [...blocks].map((block) => ({
          ...block,
          selected: prevState.find((b) => b.key === block.key)?.selected,
        })) as PageBlock[];
      }
      return [...blocks] as PageBlock[];
    });
  }, [blocks]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3000') return;
      if (event.data === 'build') {
        setBuild(true);
      } else if (event.data === 'deSelectComponent') {
        handleRemoveSelectedBlocks();
      } else {
        try {
          let data = JSON.parse(event.data);
          handlePropValueChange(data.newValue, data.propIndex, data.prop);
        } catch (e) {}
      }
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [blocks]);

  useEffect(() => {
    if (pageBlocks) {
      const message = JSON.stringify(pageBlocks);
      window.parent.postMessage(message, 'http://localhost:3000');
    }
  }, [pageBlocks]);

  const handleRemoveSelectedBlocks = () => {
    setPageBlocks((prevState) => [...prevState.map((block) => ({ ...block, selected: false }))]);
  };

  const handleMoveBlock = (position: 'up' | 'bottom', index: number) => {
    setPageBlocks((prevState) => {
      const newData = Array.from(prevState);
      const newIndex = position == 'up' ? index - 1 : index + 1;
      const temp = newData[newIndex];
      newData[newIndex] = newData[index];
      newData[index] = temp;
      return [...newData];
    });
  };

  const handleDuplicateBlock = (index: number) => {
    handleRemoveSelectedBlocks();
    setPageBlocks((prevState) => {
      const components = [...prevState];
      const componentToDuplicate = components[index];
      components.splice(index + 1, 0, { ...componentToDuplicate, id: uuidv4(), selected: true });
      return components;
    });
  };

  const handleDeleteSection = (index: number) => {
    setPageBlocks((prevState) => {
      const updatedComponents = prevState.filter((_, i) => i !== index);
      return updatedComponents;
    });
  };

  const handlePropValueChange = (newValue: any, propsIndex: number, prop: BlockProps) => {
    setPageBlocks((prevState) => {
      let blocks = [...prevState];
      let selectedBlockIndex = blocks.findIndex((c) => c.selected);
      let foundRegisterBlock = registerBlocks.find((c) => c.key === blocks[selectedBlockIndex].key);

      if (foundRegisterBlock) {
        let selectedBlock = blocks[selectedBlockIndex];

        const getPropInput = (rProp: BlockProps): any => {
          //check if the non editing prop has an input in the state
          let value = newValue;
          if (rProp.name != prop.name) {
            if (selectedBlock.inputs) {
              value =
                selectedBlock.inputs[rProp.name] != null
                  ? selectedBlock.inputs[rProp.name]
                  : foundRegisterBlock?.defaultInputs[rProp.name] != null
                  ? foundRegisterBlock?.defaultInputs[rProp.name]
                  : null;
            } else {
              value =
                foundRegisterBlock?.defaultInputs[rProp.name] != null
                  ? foundRegisterBlock?.defaultInputs[rProp.name]
                  : null;
            }
          }
          return value;
        };

        let inputs = foundRegisterBlock?.props?.map((rProp) => ({
          [rProp.name]: getPropInput(rProp),
        }));

        const mergedInputs = inputs?.reduce((result, currentObject) => {
          for (let key in currentObject) {
            result[key] = currentObject[key];
          }
          return result;
        }, {});

        selectedBlock.inputs = mergedInputs;
        blocks[selectedBlockIndex] = selectedBlock;
      }

      return [...blocks];
    });
  };

  async function handleSaveGlobalBlock(index: number) {
    let data = await insertGlobalBlock({ block: pageBlocks[index], name: globalBlockInputName, slug });
    if (data?.error) {
      setToastProps({ title: 'Failed', description: data.error, type: 'destructive' });
      return;
    }
    setToastProps({ title: 'Success', description: 'Block saved as global', type: 'default' });
  }

  async function handleRemoveGlobalBlock(globalId: string) {
    let data = await removeGlobalBlock({ id: globalId });
    if (data?.error) {
      setToastProps({ title: 'Failed', description: data.error, type: 'destructive' });
      return;
    }
    setToastProps({ title: 'Success', description: 'Block removed from globals', type: 'default' });
  }

  const handleCopyBlock = (index: number) => {
    localStorage.setItem('copiedBlock', JSON.stringify(pageBlocks[index]));
    setToastProps({ title: 'Success', description: 'Block copied!', type: 'default' });
  };

  const handlePasteBlock = (index: number, position: 'above' | 'below') => {
    let block = JSON.parse(localStorage.getItem('copiedBlock') || '');
    handleRemoveSelectedBlocks();
    setPageBlocks((prevState) => {
      const components = [...prevState];
      const componentToDuplicate = block;
      const location = position == 'below' ? index + 1 : index;
      components.splice(location, 0, { ...componentToDuplicate, id: uuidv4(), selected: true });
      localStorage.removeItem('copiedBlock');
      return components;
    });
  };

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
            setPageBlocks((prevState) => [...prevState, block]);
          }}
        />
      </div>
    );
  }
  return (
    <div className="mt-[40px] builder">
      <AlertDialog
        open={alertStatus.open}
        onOpenChange={(open) => setAlertStatus((prevState) => ({ ...prevState, open }))}
      >
        <AlertDialogContent>
          {alertStatus.action === 'removeGlobal' ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently de-register all instances of this block as global
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleRemoveGlobalBlock(alertStatus.value as string)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Save this block as global</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will make the block accessible and usable across all pages.
                  <div className="mt-2">
                    <label className=" text-xs font-semibold">Name</label>
                    <Input
                      className="mb-3 mt-1 w-full"
                      onChange={(e) => {
                        setGlobalBlockInputName(e.target.value);
                      }}
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  disabled={!globalBlockInputName.length}
                  onClick={() => handleSaveGlobalBlock(alertStatus.value as number)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

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
                return [...newData];
              }
              newData.splice(insertBlockAbove.index + 1, 0, block);
              return [...newData];
            }
            return [...prevState];
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
            <section key={block.id} className="relative group">
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
                        className={cn(' border-transparent ', {
                          'border-brand-green-50 border-[2px]': selected,
                          'border-blue-400': block.globalId,
                        })}
                        onClick={() => {
                          setPageBlocks((prevBlocks) => {
                            let components = [...prevBlocks].map((c) => ({
                              ...c,
                              selected: false,
                            }));
                            components[index].selected = true;
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
