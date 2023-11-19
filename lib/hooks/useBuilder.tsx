'use client';
import { useState, useEffect, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import registerBlocks from '@/lib/blocks_registery';
import { insertGlobalBlock, removeGlobalBlock } from '@/lib/actions/blockActions';
import { useToast } from '@/components/ui/use-toast';
import { BlockProps, PageBlock } from '../types';

type insertBlockAboveT = {
  position: 'top' | 'bottom';
  index: number;
};

const useBuilder = (blocks: PageBlock[], slug: string) => {
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);
  const [history, setHistory] = useState<PageBlock[][]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [build, setBuild] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [insertBlockAbove, setInsertBlockAbove] = useState<insertBlockAboveT>();
  const { toast } = useToast();
  const [globalBlockInputName, setGlobalBlockInputName] = useState('');
  let targetOrigin = '';

  if (typeof window !== 'undefined') {
    targetOrigin = `${window.location.protocol}//${window.location.host}`;
  }

  const canUndo: boolean = currentPosition > 0;
  const canRedo: boolean = currentPosition < history.length - 1;

  const updateHistory = (newState: PageBlock[]): void => {
    setHistory((prevHistory) => {
      const clonedHistory = prevHistory.slice(0, currentPosition + 1);
      clonedHistory.push(newState);
      setCurrentPosition(clonedHistory.length - 1);

      return clonedHistory;
    });
  };

  const undo = (): void => {
    if (canUndo) {
      setCurrentPosition((prevPos) => prevPos - 1);
      setPageBlocks([...history[currentPosition - 1]]);
    }
  };

  const redo = (): void => {
    if (canRedo) {
      setCurrentPosition((prevPos) => prevPos + 1);
      setPageBlocks([...history[currentPosition + 1]]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmdOrCtrlPressed = (event.metaKey || event.ctrlKey) && !event.altKey;

      if (isCmdOrCtrlPressed) {
        if (event.key === 'z') {
          event.preventDefault();
          undo();
        } else if (event.key === 'y') {
          event.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history, currentPosition]);

  const [alertStatus, setAlertStatus] = useState<{
    open: boolean;
    action: 'insertGlobal' | 'removeGlobal';
    value?: number | string | undefined;
  }>({
    open: false,
    action: 'insertGlobal',
  });

  function disableFixedElements() {
    const fixedElements = document.querySelectorAll<HTMLElement>('*');

    fixedElements.forEach((element) => {
      console.log(element.tagName);
      if (element.tagName === 'NAV') {
        element.classList.add('disabled-fixed-element');
      }
      if (element.style.position == 'fixed' || element.style.position == 'sticky') {
        alert('found');
        element.classList.add('disabled-fixed-element');
      }
    });
  }

  useEffect(() => {
    disableFixedElements();
    setPageBlocks((prevState) => {
      let newBlocks = [];
      if (prevState.length) {
        newBlocks = [...blocks].map((block) => ({
          ...block,
          selected: prevState.find((b) => b.key === block.key)?.selected,
        })) as PageBlock[];
        updateHistory(newBlocks);
      }
      newBlocks = [...blocks] as PageBlock[];
      setHistory([newBlocks]);
      return [...newBlocks];
    });
  }, [blocks]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== targetOrigin) return;
      if (event.data === 'build') {
        setBuild(true);
      } else if (event.data === 'deSelectComponent') {
        handleRemoveSelectedBlocks();
      } else {
        try {
          let data = JSON.parse(event.data);
          handlePropValueChange(data.newValue, data.propIndex, data.prop);
        } catch (e) {}
      }
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [blocks, history, currentPosition, targetOrigin]);

  useEffect(() => {
    if (pageBlocks) {
      const message = JSON.stringify(pageBlocks);
      window.parent.postMessage(message, targetOrigin);
    }
  }, [pageBlocks, targetOrigin]);

  const handleRemoveSelectedBlocks = () => {
    setPageBlocks((prevState) => [...prevState.map((block) => ({ ...block, selected: false }))]);
  };

  const handleMoveBlock = (position: 'up' | 'bottom', index: number) => {
    setPageBlocks((prevState) => {
      const newData = Array.from(prevState);
      const newIndex = position == 'up' ? index - 1 : index + 1;
      const temp = newData[newIndex];
      newData[newIndex] = newData[index];
      newData[index] = temp;
      updateHistory(newData);
      return [...newData];
    });
  };

  const handleDuplicateBlock = (index: number) => {
    handleRemoveSelectedBlocks();
    setPageBlocks((prevState) => {
      const components = [...prevState];
      const componentToDuplicate = components[index];
      components.splice(index + 1, 0, { ...componentToDuplicate, id: uuidv4(), selected: true });
      updateHistory(components);
      return components;
    });
  };

  const handleDeleteSection = (index: number) => {
    setPageBlocks((prevState) => {
      const updatedComponents = prevState.filter((_, i) => i !== index);
      updateHistory(updatedComponents);
      return updatedComponents;
    });
  };

  const handlePropValueChange = (newValue: any, propsIndex: number, prop: BlockProps) => {
    setPageBlocks((prevState) => {
      let blocks = [...prevState];
      let selectedBlockIndex = blocks.findIndex((c) => c.selected);
      let foundRegisterBlock = registerBlocks.find((c) => c.key === blocks[selectedBlockIndex].key);

      if (foundRegisterBlock) {
        let selectedBlock = blocks[selectedBlockIndex];

        const getPropInput = (rProp: BlockProps): any => {
          //check if the non editing prop has an input in the state
          let value = newValue;
          if (rProp.name != prop.name) {
            if (selectedBlock.inputs) {
              value =
                selectedBlock.inputs[rProp.name] != null
                  ? selectedBlock.inputs[rProp.name]
                  : foundRegisterBlock?.defaultInputs[rProp.name] != null
                  ? foundRegisterBlock?.defaultInputs[rProp.name]
                  : null;
            } else {
              value =
                foundRegisterBlock?.defaultInputs[rProp.name] != null
                  ? foundRegisterBlock?.defaultInputs[rProp.name]
                  : null;
            }
          }
          return value;
        };

        let inputs = foundRegisterBlock?.props?.map((rProp) => ({
          [rProp.name]: getPropInput(rProp),
        }));

        const mergedInputs = inputs?.reduce((result, currentObject) => {
          for (let key in currentObject) {
            result[key] = currentObject[key];
          }
          return result;
        }, {});

        selectedBlock.inputs = mergedInputs;
        blocks[selectedBlockIndex] = selectedBlock;
      }
      updateHistory(blocks);
      return [...blocks];
    });
  };

  async function handleSaveGlobalBlock(index: number) {
    let clonedBlocks = pageBlocks.map((block) => ({ ...block, component: '', icon: '' }));
    console.log(clonedBlocks);
    let data = await insertGlobalBlock({
      block: clonedBlocks[index],
      name: globalBlockInputName,
      slug,
      blocks: clonedBlocks,
    });
    if (data?.error) {
      toast({ title: 'Failed', description: data.error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Success', description: 'Block saved as global', variant: 'default' });
  }

  async function handleRemoveGlobalBlock(globalId: string) {
    let data = await removeGlobalBlock({ id: globalId });
    if (data?.error) {
      toast({ title: 'Failed', description: data.error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Success', description: 'Block removed from globals', variant: 'default' });
  }

  const handleCopyBlock = (index: number) => {
    localStorage.setItem('copiedBlock', JSON.stringify(pageBlocks[index]));
    toast({ title: 'Success', description: 'Block copied!', variant: 'default' });
  };

  const handlePasteBlock = (index: number, position: 'above' | 'below') => {
    let block = JSON.parse(localStorage.getItem('copiedBlock') || '');
    handleRemoveSelectedBlocks();
    setPageBlocks((prevState) => {
      const components = [...prevState];
      const componentToDuplicate = block;
      const location = position == 'below' ? index + 1 : index;
      components.splice(location, 0, { ...componentToDuplicate, id: uuidv4(), selected: true });
      localStorage.removeItem('copiedBlock');
      updateHistory(components);
      return components;
    });
  };

  return {
    pageBlocks,
    open,
    insertBlockAbove,
    globalBlockInputName,
    alertStatus,
    handleRemoveSelectedBlocks,
    handleMoveBlock,
    handleDuplicateBlock,
    handleDeleteSection,
    handleSaveGlobalBlock,
    handleRemoveGlobalBlock,
    handleCopyBlock,
    handlePasteBlock,
    setPageBlocks,
    setOpen,
    setInsertBlockAbove,
    setGlobalBlockInputName,
    updateHistory,
    setAlertStatus,
  };
};

export default useBuilder;
