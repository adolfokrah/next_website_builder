'use client';
import { RenderBlockControllerProps } from '@/lib/types';
import { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../../button';
import { BoxIcon, Square } from 'lucide-react';

const ColorPickerController = ({
  prop,
  propIndex,
  defaultValue,
  handlePropValueChange,
}: RenderBlockControllerProps) => {
  const [colorState, setColorState] = useState<string>(defaultValue || '#FFFFFF');
  return (
    <>
      <label className=" text-xs font-semibold">{prop.label}</label>
      <div className="mt-1" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="w-full flex justify-start gap-2 py-5">
            <Square className="border-0 rounded-sm" style={{ backgroundColor: colorState, color: colorState }} />
            {colorState}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="bg-transparent shadow-none border-0 p-0">
          <SketchPicker
            color={colorState}
            onChange={(color) => {
              setColorState(color.hex);
              handlePropValueChange(color.hex, propIndex, prop);
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ColorPickerController;
