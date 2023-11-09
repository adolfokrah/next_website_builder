import { RenderBlockControllerProps } from '@/lib/types';
import TextInputController from './textInputController';
import TextAreaController from './textAreaController';
import ColorPickerController from './colorPickerController';
import ImageUploader from './imageUploader';

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
    case 'colorPicker':
      return (
        <ColorPickerController
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
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
    case 'image':
      return (
        <ImageUploader
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
