"use client";
import { ComponentPropsValues, SideBarProps } from "@/lib/types";
import { Button } from "../button";
import { ArrowBottomLeftIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Input } from "../input";

const SideBar = ({
  registeredComponents,
  handleAddComponent,
  selectedComponent,
  handleRemoveSelectedComponent,
  handlePropValueChange,
}: SideBarProps) => {
  const renderPropValue = (
    value: ComponentPropsValues,
    propIndex: number,
    defaultValue: any
  ) => {
    switch (value) {
      case "text":
        return (
          <Input
            defaultValue={defaultValue}
            onChange={(e) => {
              handlePropValueChange(e.target.value, propIndex);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen fixed w-[300px] left-0 border-r bg-white border-r-slate-200 p-3">
      {selectedComponent ? (
        <>
          <Button variant={"outline"} onClick={handleRemoveSelectedComponent}>
            <ArrowLeftIcon />
          </Button>

          {selectedComponent.props &&
            selectedComponent.props.map((prop, index) => {
              let defaultValue = selectedComponent.inputs
                ? selectedComponent.inputs[prop.name]
                : "";

              return (
                <div
                  key={`${selectedComponent.id}_${prop.name}`}
                  className="mb-2"
                >
                  <span className=" text-sm mt-2 mb-1 font-semibold">
                    {prop.label}
                  </span>
                  {renderPropValue(prop.value, index, defaultValue)}
                </div>
              );
            })}
        </>
      ) : (
        <>
          <h5>Components</h5>
          <div className="h-full overflow-auto ">
            <div className="grid p-4 grid-cols-2 gap-2">
              {registeredComponents.map((component, index) => (
                <Button
                  key={`${component.title}${index}`}
                  variant={"outline"}
                  className="flex flex-col p-9"
                  onClick={() => handleAddComponent(component)}
                >
                  <div className="p-2">{component.icon}</div>
                  {component.title}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
