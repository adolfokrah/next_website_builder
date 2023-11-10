import { BlockProps, RenderBlockControllerProps } from '@/lib/types';
import { ChevronLeftIcon, Edit2, PlusIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../button';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import RenderBlockController from './renderBlocksController';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder, DropResult } from 'react-beautiful-dnd';

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

  const onDragEnd = (result: DropResult) => {
    setLIstItems((prevState) => {
      const updatedItems = [...prevState];
      if (result.destination) {
        const [reorderedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, reorderedItem);
      }
      return [...updatedItems];
    });
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {listItems?.map((item, index) => (
                        <Draggable key={index} draggableId={`item-${index}`} index={index}>
                          {(provided) => (
                            <div
                              key={item.key}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div
                                className=" flex gap-2 p-2 bg-white relative justify-between group hover:bg-slate-100 rounded-md transition-colors duration-100 ease-linear cursor-pointer"
                                onClick={() => setSelectedItemIndex(index)}
                              >
                                <div className="flex gap-2 text-center flex-1">
                                  {prop.listDisplayedLabels?.image && item[prop.listDisplayedLabels.image]?.url && (
                                    <div className="w-[50px] h-[50px] relative flex-shrink-0">
                                      <Image
                                        fill
                                        sizes="100%"
                                        alt="fancy-list-image"
                                        src={item[prop.listDisplayedLabels.image]?.url || ''}
                                        className="rounded-sm object-fill"
                                      />
                                    </div>
                                  )}
                                  <div className={cn('text-left flex-1 ')}>
                                    <p className="text-sm truncate w-full">
                                      {prop.listDisplayedLabels
                                        ? item[prop.listDisplayedLabels.title] || `Item ${index}`
                                        : `Item ${index}`}
                                    </p>
                                    {prop.listDisplayedLabels?.caption && (
                                      <p className="text-xs text-slate-400 mt-1 w-full truncate">
                                        {item[prop.listDisplayedLabels.caption] || ''}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="absolute right-0 flex gap-1 h-full items-center justify-center top-0 pl-5 bg-gradient-to-r from-transparent to-white">
                                  <Button variant={'outline'} className="hidden group-hover:block bg-white">
                                    <Edit2 size={17} />
                                  </Button>
                                  <Button
                                    variant={'outline'}
                                    className=" invisible group-hover:visible bg-white"
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* {listItems?.map((item, index) => (
                <div key={item.key}>
                  <div
                    className=" flex gap-2 p-2 relative justify-between group hover:bg-slate-100 rounded-md transition-colors duration-100 ease-linear cursor-pointer"
                    onClick={() => setSelectedItemIndex(index)}
                  >
                    <div className="flex gap-2 text-center flex-1">
                      {prop.listDisplayedLabels?.image && item[prop.listDisplayedLabels.image]?.url && (
                        <div className="w-[50px] h-[50px] relative flex-shrink-0">
                          <Image
                            fill
                            sizes="100%"
                            alt="fancy-list-image"
                            src={item[prop.listDisplayedLabels.image]?.url || ''}
                            className="rounded-sm object-fill"
                          />
                        </div>
                      )}
                      <div className={cn('text-left flex-1 ')}>
                        <p className="text-sm truncate w-full">
                          {prop.listDisplayedLabels
                            ? item[prop.listDisplayedLabels.title] || `Item ${index}`
                            : `Item ${index}`}
                        </p>
                        {prop.listDisplayedLabels?.caption && (
                          <p className="text-xs text-slate-400 mt-1 w-full truncate">
                            {item[prop.listDisplayedLabels.caption] || ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="absolute right-0 flex gap-1 h-full items-center justify-center top-0 pl-5 bg-gradient-to-r from-transparent to-white">
                      <Button variant={'outline'} className="hidden group-hover:block bg-white">
                        <Edit2 size={17} />
                      </Button>
                      <Button
                        variant={'outline'}
                        className=" invisible group-hover:visible bg-white"
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
              ))} */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ListController;
