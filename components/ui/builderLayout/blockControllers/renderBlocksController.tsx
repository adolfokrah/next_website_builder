import { RenderBlockControllerProps } from '@/lib/types';
import TextInputController from './textInputController';
import TextAreaController from './textAreaController';
import ColorPickerController from './colorPickerController';
import ImageController from './imageController';
import ListController from './listController';
import LinkController from './linkController';

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
        <ImageController
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
          handlePropValueChange={handlePropValueChange}
        />
      );
    case 'list':
      return (
        <ListController
          prop={prop}
          propIndex={propIndex}
          defaultValue={defaultValue}
          handlePropValueChange={handlePropValueChange}
        />
      );
    case 'link':
      return (
        <LinkController
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
