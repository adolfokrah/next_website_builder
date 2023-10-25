"use client";
import { Component, ComponentProps, pageComponent } from "@/lib/types";
import SideBar from "./sidebar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import NavBar from "./navbar";
import { useQuery } from "react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "../use-toast";

type BuilderProps = {
  registeredComponents: Component[];
  page: string[];
};

const Builder = ({ registeredComponents, page }: BuilderProps) => {
  const [pageComponents, setPageComponents] = useState<pageComponent[]>([]);
  const pageName = `/${page.join("/")}`;
  let selectedComponent: pageComponent | undefined = pageComponents.find(
    (component) => component.selected
  );
  const { toast } = useToast();

  const handleRemoveSelectedComponent = () => {
    let allComponents = [...pageComponents];
    allComponents = allComponents.map((c) => ({ ...c, selected: false }));
    setPageComponents(() => [...allComponents]);
  };

  const handleSelectComponent = (index: number) => {
    let components = [...pageComponents].map((c) => ({
      ...c,
      selected: false,
    }));
    components[index].selected = true;
    setPageComponents(() => [...components]);
  };

  const handlePropValueChange = (newValue: any, propsIndex: number) => {
    let components = [...pageComponents];
    let selectedComponentIndex = components.findIndex((c) => c.selected);
    let selectedComponent = components[selectedComponentIndex];
    let selectedComponentProp: ComponentProps | undefined =
      selectedComponent.props ? selectedComponent.props[propsIndex] : undefined;

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

    let response = await fetch("/api/page", {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (response.status == 200) {
      toast({
        description: "Changes saved successfully",
      });
    }
  };

  const fetchPageComponents = async () => {
    let response = await fetch(`/api/page?page=${pageName}`, {
      method: "GET",
    });
    let data = await response.json();
    return data;
  };

  const { data, isFetching, error } = useQuery({
    queryKey: [pageName],
    queryFn: fetchPageComponents,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data) {
      let components = data.components.map((component: any) => {
        let foundComponent = registeredComponents.find(
          (c) => c.title === component.component
        );
        return {
          ...foundComponent,
          selected: false,
          inputs: component.inputs || foundComponent?.defaultInputs,
          id: uuidv4(),
        };
      });
      setPageComponents([...components]);
    }
  }, [data]);

  if (isFetching) {
    return <div>Fetching.. content</div>;
  }

  if (!data) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <NavBar handleSaveChanges={handleSaveChanges} />
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
      <div className="pl-[310px] pt-[60px] pr-1">
        {pageComponents.map((component, index) => {
          const Tag = component.component;
          const inputs = component.inputs;
          return (
            <section
              key={`${component.title}_${index}`}
              className={cn(
                " outline outline-1 outline-transparent hover:outline-blue-500",
                {
                  " outline-blue-500": component.selected,
                }
              )}
              onClick={() => {
                handleSelectComponent(index);
              }}
            >
              <Tag {...inputs} />
            </section>
          );
        })}
      </div>
      <Toaster />
    </>
  );
};

export default Builder;
