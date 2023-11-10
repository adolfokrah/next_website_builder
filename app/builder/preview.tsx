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

type insertBlockAboveT = {
  position: 'top' | 'bottom';
  index: number;
};
const BuilderBlocks = ({ blocks }: { blocks: object[] }) => {
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([...blocks] as PageBlock[]);
  const [build, setBuild] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [insertBlockAbove, setInsertBlockAbove] = useState<insertBlockAboveT>();

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
  }, []);

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

  const handleCopyBlock = (index: number) => {
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

  //   if (!build) return null;

  if (!pageBlocks.length) {
    return (
      <>
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
        <BlocksCommandPallet
          open={open}
          setOpen={setOpen}
          addPageBlock={(block) => {
            console.log('blocksdfs', block);
            handleRemoveSelectedBlocks();
            setPageBlocks((prevState) => [...prevState, block]);
          }}
        />
      </>
    );
  }
  return (
    <div className="mt-[40px] builder">
      <BlocksCommandPallet
        open={open}
        setOpen={setOpen}
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
                          className=" w-6 h-6 p-0"
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
                          className=" w-6 h-6 p-0"
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
                        className=" w-6 h-6 p-0"
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
                        <Button className=" w-6 h-6 p-0" onClick={() => handleCopyBlock(index)}>
                          <Copy size={17} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="center">
                        <p>Copy block</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className=" w-6 h-6 p-0" onClick={() => handleDeleteSection(index)}>
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
                        className=" w-6 h-6 p-0"
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
    </div>
  );
};
export default BuilderBlocks;
