'use client';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { SlidersHorizontal, XIcon } from 'lucide-react';
import RenderBlockController from './blockControllers/renderBlocksController';
import registerBlocks from '@/lib/blocks_registery';
import { BlockProps } from '@/lib/types';

const ControllersSideBar = () => {
  const { pageBlocks, setMessageToIframe } = useBuilderState();
  const selectedBlock = pageBlocks.find((block) => block.selected);
  const foundBlockInRegister = registerBlocks.find(
    (block) => block.title.toLowerCase() === selectedBlock?.title.toLowerCase(),
  );
  const handlePropValueChange = (newValue: any, propIndex: number, prop: BlockProps) => {
    setMessageToIframe(JSON.stringify({ newValue, propIndex, prop }));
  };

  return (
    <div
      className={cn('w-[320px] h-screen flex-shrink-0 transition-all duration-300 ease-linear', {
        'w-0': !selectedBlock,
      })}
    >
      <div
        className={cn(
          'h-screen bg-transparent z-10   fixed w-[320px] pt-[60px] border-l right-[-330px]  border-r-slate-200 transition-all duration-300 ease-linear',
          {
            'right-0': selectedBlock,
          },
        )}
      >
        <div className="w-full text-center border-b items-center flex justify-between border-b-slate-100 text-slate-900 px-2 py-4 text-sm transition-colors duration-150 ease-linear cursor-pointer">
          <div className="text-center w-full">{selectedBlock?.title}</div>
          <Button
            variant={'outline'}
            onClick={() => {
              setMessageToIframe('deSelectComponent');
            }}
          >
            <XIcon size={17} />
          </Button>
        </div>
        <div className="p-2 overflow-y-auto h-full">
          {foundBlockInRegister?.props &&
            selectedBlock?.props &&
            foundBlockInRegister.props.map((prop) => {
              let defaultValue = selectedBlock.inputs ? selectedBlock.inputs[prop.name] : null;
              let index = selectedBlock.props?.findIndex((iProp) => iProp.type === prop.type);

              return (
                <div key={`${selectedBlock.id}_${prop.name}_${prop.type}`} className="mb-2">
                  <RenderBlockController
                    prop={prop}
                    propIndex={index == null ? -1 : index}
                    defaultValue={defaultValue}
                    handlePropValueChange={handlePropValueChange}
                  />
                </div>
              );
            })}
        </div>
        {!foundBlockInRegister?.props && (
          <div className="h-full w-full grid place-items-center">
            <div className="text-center">
              <div className=" mb-4 w-28 h-28 grid place-items-center bg-slate-100 rounded-full m-auto">
                <SlidersHorizontal className=" text-slate-500" size={40} />
              </div>
              <p className="text-sm text-slate-700">This block has no controllers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControllersSideBar;
