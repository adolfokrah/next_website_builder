import { ComponentType } from 'react';

export type BlockPropsTypes = 'text' | 'number' | 'list' | 'image';

export type BlockProps = {
  name: string;
  type: BlockPropsTypes;
  label: string;
};

export type Block = {
  component: ComponentType<any>;
  title: string;
  icon: React.ReactNode;
  props?: BlockProps[];
  defaultInputs: object;
};

export type pageBlock = Block & {
  selected: boolean;
  inputs: { [key: string]: any } | undefined;
  id: string;
};

export type SideBarProps = {
  registeredBlocks: Block[];
  handleAddBlock: (Block: Block) => void;
  selectedBlock: pageBlock | undefined;
  handleRemoveSelectedBlock: () => void;
  handlePropValueChange: (newValue: any, propIndex: number) => void;
};

export type RenderBlockControllerProps = {
  prop: BlockProps;
  propIndex: number;
  defaultValue: any;
  handlePropValueChange: (newValue: any, propIndex: number) => void;
};

export type ToasterProps = {
  title: string;
  description: string;
  type: 'default' | 'destructive';
};
