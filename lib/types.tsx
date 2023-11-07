import { ComponentType } from 'react';

export type ControllerTypes = 'text' | 'number' | 'list' | 'image';

export type BlockProps = {
  name: string;
  type: ControllerTypes;
  label: string;
};

export type Block = {
  component: ComponentType<any>;
  title: string;
  icon: React.ReactNode;
  props?: BlockProps[];
  defaultInputs: object;
};

export type PageBlock = Block & {
  selected: boolean;
  inputs: { [key: string]: any } | undefined;
  id: string;
};

export type SideBarProps = {
  registeredBlocks: Block[];
  handleAddBlock: (Block: Block) => void;
  selectedBlock: PageBlock | undefined;
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

export type ViewPorts = 'Desktop' | 'Mobile' | 'Tablet';

export type BuilderStateProps = {
  showPageSideBar: boolean;
  viewPort: ViewPorts;
  pageId: string;
  pageBlocks: PageBlock[];
  messageToIframe: string;
  togglePageSideBar: () => void;
  setViewPort: (viewPort: ViewPorts) => void;
  setPageBlocks: (blocks: object[]) => void;
  setPageId: (id: string) => void;
  setMessageToIframe: (message: string) => void;
};
