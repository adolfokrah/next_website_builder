import { BlockProps, RenderBlockControllerProps } from '@/lib/types';
import { ChevronLeftIcon, Edit2, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../button';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import RenderBlockController from './renderBlocksController';
import { v4 as uuidv4 } from 'uuid';

const ListController = ({ prop, propIndex, defaultValue, handlePropValueChange }: RenderBlockControllerProps) => {
  const [listItems, setLIstItems] = useState<{ [key: string]: any }[]>(defaultValue || []);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>();

  useEffect(() => {
    handlePropValueChange(listItems, propIndex, prop);
  }, [listItems]);

  const addNewItem = () => {
    if (prop.schema) {
      let data: { [key: string]: any } = prop.schema
        .map((item) => ({
          [item.name]: undefined,
        }))
        .reduce((accumulator, current) => {
          const key = Object.keys(current)[0];
          accumulator[key] = current[key];
          return accumulator;
        }, {});
      data['key'] = uuidv4();

      setLIstItems((prevState) => [...prevState, data]);
    }
  };

  return (
    <>
      <label className=" text-xs font-semibold">{prop.label}</label>
      <div className="w-full rounded-md border mt-2 border-slate-200  p-2 relative">
        {selectedItemIndex != undefined && (
          <>
            <div className="flex gap-2 items-center">
              <Button variant="ghost" onClick={() => setSelectedItemIndex(undefined)}>
                <ChevronLeftIcon size={17} />
              </Button>
              <p className="text-sm text-slate-800 truncate w-[300px]">
                {prop.listDisplayedLabels
                  ? `${
                      listItems[selectedItemIndex][prop.listDisplayedLabels?.title || ''] || `Item ${selectedItemIndex}`
                    }`
                  : `Item ${selectedItemIndex}`}
              </p>
            </div>

            <div className="mt-2">
              {prop.schema?.map((schema) => {
                let value = listItems[selectedItemIndex][schema.name] || null;
                return (
                  <div key={schema.name}>
                    <RenderBlockController
                      prop={schema as BlockProps}
                      propIndex={selectedItemIndex == null ? -1 : selectedItemIndex}
                      defaultValue={value}
                      handlePropValueChange={(newValue, propIndex, prop) => {
                        setLIstItems((prevState) => {
                          let newLIst = structuredClone(prevState);
                          newLIst[propIndex][schema.name] = newValue;
                          return [...newLIst];
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}

        {selectedItemIndex === undefined && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">{listItems.length} items</p>
              <Button variant="outline" onClick={addNewItem}>
                <PlusIcon size={17} />
              </Button>
            </div>

            <div className="mt-2">
              {listItems?.map((item, index) => (
                <div key={item.key}>
                  <div
                    className=" flex gap-2 p-2 justify-between group hover:bg-slate-100 rounded-md transition-colors duration-100 ease-linear cursor-pointer"
                    onClick={() => setSelectedItemIndex(index)}
                  >
                    <div className="flex gap-2 text-center">
                      {prop.listDisplayedLabels?.image && (
                        <div className="w-[50px] h-[50px] relative">
                          <Image
                            fill
                            sizes="100%"
                            alt="fancy-list-image"
                            src={item[prop.listDisplayedLabels.image]?.url || ''}
                            className="rounded-sm object-fill"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm truncate w-[120px]">
                          {prop.listDisplayedLabels
                            ? item[prop.listDisplayedLabels.title] || `Item ${index}`
                            : `Item ${index}`}
                        </p>
                        {prop.listDisplayedLabels?.caption && (
                          <p className="text-xs text-slate-400 mt-1 w-[120px] truncate">
                            {item[prop.listDisplayedLabels.caption] || ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant={'outline'} className="hidden group-hover:block">
                        <Edit2 size={17} />
                      </Button>
                      <Button
                        variant={'outline'}
                        className=" invisible group-hover:visible"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLIstItems((prevState) => [
                            ...prevState.filter((listItem, listIndex) => index != listIndex),
                          ]);
                        }}
                      >
                        <Trash2Icon size={17} />
                      </Button>
                    </div>
                  </div>
                  {index < listItems.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ListController;
