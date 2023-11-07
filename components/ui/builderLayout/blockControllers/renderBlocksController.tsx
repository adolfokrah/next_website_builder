import { RenderBlockControllerProps } from '@/lib/types';
import TextInputController from './textInputController';
import ColorSetter from './colorSetter';
import TextAreaController from './textAreaController';

const RenderBlockController = ({
  prop,
  propIndex,
  defaultValue,
  handlePropValueChange,
}: RenderBlockControllerProps) => {
  switch (prop.type) {
    case 'text':
      return (
        <TextInputController
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
          type={prop.type}
          handlePropValueChange={handlePropValueChange}
        />
      );
    case 'number':
      return (
        <TextInputController
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
          type={prop.type}
          handlePropValueChange={handlePropValueChange}
        />
      );
    case 'colorSetter':
      return (
        <ColorSetter
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
          type={prop.type}
          handlePropValueChange={handlePropValueChange}
        />
      );
    case 'textArea':
      return (
        <TextAreaController
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
          handlePropValueChange={handlePropValueChange}
        />
      );
    default:
      return null;
  }
};

export default RenderBlockController;
