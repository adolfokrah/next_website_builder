import { Input } from '../../input';
import { RenderBlockControllerProps } from '@/lib/types';

const TextInputController = ({
  prop,
  propIndex,
  defaultValue,
  handlePropValueChange,
  type,
}: RenderBlockControllerProps & { type: string }) => {
  return (
    <>
      <label className=" text-xs font-semibold">{prop.label}</label>
      <Input
        className="mb-3 mt-1"
        defaultValue={defaultValue}
        onChange={(e) => {
          handlePropValueChange(e.target.value, propIndex);
        }}
        type={type}
      />
    </>
  );
};

export default TextInputController;