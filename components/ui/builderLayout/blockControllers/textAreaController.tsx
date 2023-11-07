import { Input } from '../../input';
import { RenderBlockControllerProps } from '@/lib/types';
import { Textarea } from '../../textarea';

const TextAreaController = ({ prop, propIndex, defaultValue, handlePropValueChange }: RenderBlockControllerProps) => {
  return (
    <>
      <label className=" text-xs font-semibold">{prop.label}</label>
      <Textarea
        className="mb-3 mt-1 h-28"
        defaultValue={defaultValue}
        onChange={(e) => {
          handlePropValueChange(e.target.value, propIndex, prop);
        }}
      />
    </>
  );
};

export default TextAreaController;
