import { ComponentType } from 'react';

export type ComponentPropsValues = 'text' | 'number' | 'list' | 'image';

export type ComponentProps = {
  name: string;
  type: ComponentPropsValues;
  label: string;
};

export type Component = {
  component: ComponentType<any>;
  title: string;
  icon: React.ReactNode;
  props?: ComponentProps[];
  defaultInputs: object;
};

export type pageComponent = Component & {
  selected: boolean;
  inputs: { [key: string]: any } | undefined;
  id: string;
};

export type SideBarProps = {
  registeredComponents: Component[];
  handleAddComponent: (component: Component) => void;
  selectedComponent: pageComponent | undefined;
  handleRemoveSelectedComponent: () => void;
  handlePropValueChange: (newValue: any, propIndex: number) => void;
};

export type RenderComponentControllerProps = {
  prop: ComponentProps;
  propIndex: number;
  defaultValue: any;
  handlePropValueChange: (newValue: any, propIndex: number) => void;
};
