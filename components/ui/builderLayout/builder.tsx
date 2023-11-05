'use client';
import { Component, ComponentProps, pageComponent } from '@/lib/types';
import SideBar from './sidebarOld';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './navbar';
import { useQuery } from 'react-query';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '../use-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { BiSolidTrashAlt, BiSolidCopy } from 'react-icons/bi';

type BuilderProps = {
  registeredComponents: Component[];
  page: string[];
};

const Builder = ({ registeredComponents, page }: BuilderProps) => {
  const [pageComponents, setPageComponents] = useState<pageComponent[]>([]);
  const pageName = `/${page.join('/')}`;
  let selectedComponent: pageComponent | undefined = pageComponents.find((component) => component.selected);
  const { toast } = useToast();

  const handleRemoveSelectedComponent = () => {
    setPageComponents((prevComponents) => {
      let allComponents = [...prevComponents];
      allComponents = allComponents.map((c) => ({ ...c, selected: false }));
      return [...allComponents];
    });
  };

  const handleSelectComponent = (index: number) => {
    setPageComponents((pageComponents) => {
      let components = [...pageComponents].map((c) => ({
        ...c,
        selected: false,
      }));
      components[index].selected = true;
      return [...components];
    });
  };

  const handlePropValueChange = (newValue: any, propsIndex: number) => {
    let components = [...pageComponents];
    let selectedComponentIndex = components.findIndex((c) => c.selected);
    let selectedComponent = components[selectedComponentIndex];
    let selectedComponentProp: ComponentProps | undefined = selectedComponent.props
      ? selectedComponent.props[propsIndex]
      : undefined;

    if (selectedComponentProp) {
      let inputs = {
        ...selectedComponent.inputs,
        [selectedComponentProp.name]: newValue,
      };

      selectedComponent.inputs = inputs;
      components[selectedComponentIndex] = selectedComponent;
      setPageComponents(() => [...components]);
    }
  };

  const handleSaveChanges = async () => {
    let body = {
      name: pageName,
      components: pageComponents.map((component) => ({
        component: component.title,
        inputs: component.inputs,
      })),
    };

    let response = await fetch('/api/page', {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (response.status == 200) {
      toast({
        description: 'Changes saved successfully',
      });
    }
  };

  const fetchPageComponents = async () => {
    let response = await fetch(`/api/page?page=${pageName}`, {
      method: 'GET',
    });
    let data = await response.json();
    return data;
  };

  const { data, isFetching, error } = useQuery({
    queryKey: [pageName],
    queryFn: fetchPageComponents,
    refetchOnMount: false,
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === 'content') {
      setPageComponents((prevComponents) => {
        const newData = Array.from(prevComponents);
        const [removed] = newData.splice(source.index, 1);
        newData.splice(destination.index, 0, removed);
        return newData;
      });
      return;
    }

    if (destination.droppableId === 'content') {
      const componentTitle = draggableId.replace(/_/g, ' ');
      let foundComponent: Component | undefined =
        registeredComponents.find((component) => component.title === componentTitle) || undefined;

      if (foundComponent) {
        const newData = Array.from(pageComponents);
        const item = {
          ...foundComponent,
          selected: true,
          inputs: foundComponent?.defaultInputs,
          id: uuidv4(),
        };
        newData.splice(destination.index, 0, item);
        setPageComponents(() => {
          return newData;
        });
      }
    }
  };

  const handleDeleteSection = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    setPageComponents((prevComponents) => {
      const updatedComponents = prevComponents.filter((_, i) => i !== index);
      return updatedComponents;
    });
  };

  const handleDuplicateSection = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    handleRemoveSelectedComponent();
    setPageComponents((prevComponents) => {
      const components = [...prevComponents];
      const componentToDuplicate = components[index];
      components.splice(index + 1, 0, { ...componentToDuplicate, id: uuidv4(), selected: true });
      return components;
    });
  };

  useEffect(() => {
    if (data) {
      let components = data.components.map((component: any) => {
        let foundComponent = registeredComponents.find((c) => c.title === component.component);
        return {
          ...foundComponent,
          selected: false,
          inputs: component.inputs || foundComponent?.defaultInputs,
          id: uuidv4(),
        };
      });
      setPageComponents([...components]);
    }
  }, [data, registeredComponents]);

  if (isFetching) {
    return <div>Fetching.. content</div>;
  }

  if (!data) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <NavBar handleSaveChanges={handleSaveChanges} page={pageName} />
      <DragDropContext onDragEnd={onDragEnd}>
        <SideBar
          registeredComponents={registeredComponents}
          handleAddComponent={(component) => {
            handleRemoveSelectedComponent();
            setPageComponents((pageComponents) => [
              ...pageComponents,
              {
                ...component,
                selected: true,
                id: uuidv4(),
                inputs: component.defaultInputs,
              },
            ]);
          }}
          selectedComponent={selectedComponent}
          handleRemoveSelectedComponent={handleRemoveSelectedComponent}
          handlePropValueChange={handlePropValueChange}
        />
        <Droppable droppableId={'content'}>
          {(provided, snapshot) => (
            <div
              className={cn('pl-[310px] pt-[60px] pr-1', {
                'bg-sky-50': snapshot.isDraggingOver,
              })}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {pageComponents.map((component, index) => {
                const Tag = component.component;
                const inputs = component.inputs;
                return (
                  <Draggable key={component.id} draggableId={component.id} index={index}>
                    {(provided) => (
                      <section
                        key={component.id}
                        className={cn('relative group border border-transparent   hover:border-blue-500 builder', {
                          ' border-blue-500 block': component.selected,
                        })}
                        onClick={() => {
                          handleSelectComponent(index);
                        }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Tag {...inputs} />
                        <div className=" bg-blue-500 absolute right-0 p-1 hidden group-hover:block  top-0 ">
                          <div className="flex gap-2">
                            <BiSolidTrashAlt
                              className="text-white cursor-pointer"
                              onClick={(e: MouseEvent) => handleDeleteSection(e, index)}
                            />
                            <BiSolidCopy
                              className="text-white cursor-pointer"
                              onClick={(e: MouseEvent) => handleDuplicateSection(e, index)}
                            />
                          </div>
                        </div>
                      </section>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Toaster />
    </>
  );
};

export default Builder;
