import { Button } from '../../button';
import { Input } from '../../input';
import { RenderBlockControllerProps } from '@/lib/types';

const ColorSetter = ({
  prop,
  propIndex,
  defaultValue,
  handlePropValueChange,
  type,
}: RenderBlockControllerProps & { type: string }) => {
  return (
    <>
      <label className=" text-xs font-semibold">{prop.label}</label>
      <br />
      <Button
        className="mb-3 mt-1"
        onClick={() => {
          handlePropValueChange('yellow', propIndex, prop);
        }}
      >
        set color to yellow
      </Button>
    </>
  );
};

export default ColorSetter;
