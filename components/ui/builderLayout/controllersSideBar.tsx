'use client';
import { useBuilderState } from '@/lib/useBuilderState';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { InfoIcon, Loader2, SlidersHorizontal, XIcon } from 'lucide-react';
import RenderBlockController from './blockControllers/renderBlocksController';
import registerBlocks from '@/lib/blocks_registery';
import { BlockProps, GlobalBlock } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '../use-toast';
import { useEffect, useState } from 'react';
import { ToasterProps } from '@/lib/types';
import { updateGlobalBlock } from '@/lib/actions/blockActions';

const ControllersSideBar = () => {
  const { pageBlocks, setMessageToIframe } = useBuilderState();
  const selectedBlock = pageBlocks.find((block) => block.selected);
  const foundBlockInRegister = registerBlocks.find((block) => block.key === selectedBlock?.key);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [toastProps, setToastProps] = useState<ToasterProps>();

  useEffect(() => {
    if (toastProps) {
      toast({
        title: toastProps?.title,
        description: toastProps?.description,
        variant: toastProps?.type,
      });
    }
  }, [toastProps, toast]);

  async function handleSaveGlobalBlock(block: GlobalBlock, id: string | undefined) {
    if (id) {
      setLoading(true);
      let data = await updateGlobalBlock({ block, id });
      setLoading(false);
      if (data.error) {
        setToastProps({ title: 'Failed', description: data.error, type: 'destructive' });
        return;
      }
      setToastProps({ title: 'Success', description: 'Global block updated', type: 'default' });
    }
  }

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
          <div className="text-center w-full">{foundBlockInRegister?.title}</div>
          <Button
            variant={'outline'}
            onClick={() => {
              setMessageToIframe('deSelectComponent');
            }}
          >
            <XIcon size={17} />
          </Button>
        </div>

        {!foundBlockInRegister?.props ? (
          <div className="h-full w-full grid place-items-center">
            <div className="text-center">
              <div className=" mb-4 w-28 h-28 grid place-items-center bg-slate-100 rounded-full m-auto">
                <SlidersHorizontal className=" text-slate-500" size={40} />
              </div>
              <p className="text-sm text-slate-700">This block has no controllers</p>
            </div>
          </div>
        ) : (
          <div className="p-2 overflow-y-auto h-[90%]">
            {selectedBlock?.globalId && (
              <Alert className=" bg-sky-300">
                <InfoIcon className="mr-2" size={17} />
                <AlertDescription className="text-sm">
                  Changes made to this global block will affect all instances. <br />
                  <small>Scroll down to see saved changes button</small>
                </AlertDescription>
              </Alert>
            )}

            {foundBlockInRegister?.props &&
              selectedBlock?.props &&
              foundBlockInRegister.props.map((prop) => {
                let defaultValue = selectedBlock.inputs
                  ? selectedBlock.inputs[prop.name]
                  : foundBlockInRegister.defaultInputs;
                let index = selectedBlock.props?.findIndex((iProp) => iProp.type === prop.type);

                return (
                  <div key={`${selectedBlock.id}_${prop.name}_${prop.type}`} className="mb-2 mt-2">
                    <RenderBlockController
                      prop={prop}
                      propIndex={index == null ? -1 : index}
                      defaultValue={defaultValue}
                      handlePropValueChange={handlePropValueChange}
                    />
                  </div>
                );
              })}

            {selectedBlock?.globalId && (
              <Button
                className="w-full mt-2"
                onClick={() =>
                  handleSaveGlobalBlock(
                    {
                      id: selectedBlock.id,
                      key: selectedBlock.key,
                      inputs: selectedBlock.inputs as object[],
                      globalId: selectedBlock.globalId || '',
                    },
                    selectedBlock?.globalId,
                  )
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {'Saving...'}
                  </>
                ) : (
                  'Save global changes'
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControllersSideBar;
