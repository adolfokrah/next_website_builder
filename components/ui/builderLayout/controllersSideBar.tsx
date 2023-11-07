'use client';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { XIcon } from 'lucide-react';
import RenderBlockController from './blockControllers/renderBlocksController';

const ControllersSideBar = () => {
  const { pageBlocks, setMessageToIframe } = useBuilderState();
  const selectedBlock = pageBlocks.find((block) => block.selected);
  const handlePropValueChange = (newValue: any, propIndex: number) => {
    setMessageToIframe(JSON.stringify({ newValue, propIndex }));
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
        <div className="p-2">
          {selectedBlock?.props &&
            selectedBlock.props.map((prop, index) => {
              let defaultValue = selectedBlock.inputs ? selectedBlock.inputs[prop.name] : '';

              return (
                <div key={`${selectedBlock.id}_${prop.name}`} className="mb-2">
                  <RenderBlockController
                    prop={prop}
                    propIndex={index}
                    defaultValue={defaultValue}
                    handlePropValueChange={handlePropValueChange}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ControllersSideBar;
