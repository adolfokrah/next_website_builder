import { useEffect, useState } from 'react';
import { PageBlock } from '../types';

interface UndoRedoHook {
  state: PageBlock[];
  updateState: (newState: PageBlock[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function useUndoRedo(initialState: PageBlock[]): UndoRedoHook {
  const [state, setState] = useState<PageBlock[]>([]);
  const [history, setHistory] = useState<PageBlock[][]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const canUndo: boolean = currentPosition > 0;
  const canRedo: boolean = currentPosition < history.length - 1;

  useEffect(() => {
    updateState(initialState);
  }, [initialState]);

  const updateState = (newState: PageBlock[]): void => {
    setHistory((prevHistory) => {
      // Discard redo history
      const newHistory: PageBlock[][] = prevHistory.slice(0, currentPosition + 1);

      // Add the new state to the history
      newHistory.push(newState);
      setCurrentPosition(newHistory.length - 1);
      // Update state and current position
      return newHistory;
    });

    setState(newState);
  };

  const undo = (): void => {
    if (canUndo) {
      setCurrentPosition(currentPosition - 1);
      setState(history[currentPosition - 1]);
    }
  };

  const redo = (): void => {
    if (canRedo) {
      setCurrentPosition(currentPosition + 1);
      setState(history[currentPosition + 1]);
    }
  };

  return { state, updateState, undo, redo, canUndo, canRedo };
}
