import { Page } from '@prisma/client';
import { ComponentType } from 'react';

export type ControllerTypes = 'text' | 'number' | 'list' | 'image' | 'colorPicker' | 'textArea' | 'link';

export type LinkT = {
  url: string;
  target: string;
};
export type BlockProps = {
  name: string;
  type: ControllerTypes;
  label: string;
  schema?: BlockProps[];
  listDisplayedLabels?: {
    title: string;
    caption?: string;
    image?: string;
  };
};

export type Block = {
  component: ComponentType<any>;
  title: string;
  key: string;
  icon: React.ReactNode;
  props?: BlockProps[];
  defaultInputs: { [key: string]: any };
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
  handlePropValueChange: (newValue: any, propIndex: number, prop: BlockProps) => void;
};

export type ToasterProps = {
  title: string;
  description: string;
  type: 'default' | 'destructive';
};

export type ViewPorts = 'Desktop' | 'Mobile' | 'Tablet';

type buildStatusT = 'saved' | 'unSaved';

export type BuilderStateProps = {
  pages: Page[];
  showPageSideBar: boolean;
  viewPort: ViewPorts;
  pageId: string;
  pageBlocks: PageBlock[];
  buildStatus: 'saved' | 'unSaved';
  messageToIframe: string;
  togglePageSideBar: () => void;
  setViewPort: (viewPort: ViewPorts) => void;
  setPageBlocks: (blocks: object[]) => void;
  setPageId: (id: string) => void;
  setMessageToIframe: (message: string) => void;
  setBuildStatus: (status: buildStatusT) => void;
  setPages: (pages: Page[]) => void;
};

export type ImageT = {
  url: string;
  width: number;
  height: number;
  alt?: string;
};
