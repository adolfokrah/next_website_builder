import { useEffect, useState } from 'react';
import { Input } from '../../input';
import { RenderBlockControllerProps } from '@/lib/types';

const TextInputController = ({
  prop,
  propIndex,
  defaultValue,
  handlePropValueChange,
  type,
}: RenderBlockControllerProps & { type: string }) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <label className=" text-xs font-semibold">{prop.label}</label>
      <Input
        className="mb-3 mt-1"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handlePropValueChange(e.target.value, propIndex, prop);
        }}
        type={type}
      />
    </>
  );
};

export default TextInputController;
