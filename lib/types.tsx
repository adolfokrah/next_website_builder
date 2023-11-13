import { PageStatus } from '@prisma/client';
import { ComponentType } from 'react';

export type ControllerTypes = 'text' | 'number' | 'list' | 'image' | 'colorPicker' | 'textArea' | 'link' | 'richText';

export type LinkT = {
  url: string | undefined;
  target: string | undefined;
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
  globalId?: string;
};

export type GlobalBlock = {
  id: string;
  key: string;
  inputs: { [key: string]: any };
  globalId: string | null;
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

export type SideBarPage = { name: string; slug: string; id: string; status: PageStatus };
export type BuilderStateProps = {
  pages: SideBarPage[];
  showPageSideBar: boolean;
  viewPort: ViewPorts;
  pageId: string;
  pageBlocks: PageBlock[];
  buildStatus: 'saved' | 'unSaved';
  messageToIframe: string;
  togglePageSideBar: () => void;
  setViewPort: (viewPort: ViewPorts) => void;
  setPageBlocks: (blocks: PageBlock[]) => void;
  setPageId: (id: string) => void;
  setMessageToIframe: (message: string) => void;
  setBuildStatus: (status: buildStatusT) => void;
  setPages: (pages: SideBarPage[]) => void;
};

export type ImageT = {
  url: string | undefined;
  width: number | undefined;
  height: number | undefined;
  alt?: string;
};
