import { RenderBlockControllerProps } from '@/lib/types';
import TextInputController from './textInputController';

const RenderComponentController = ({
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
    default:
      return null;
  }
};

export default RenderComponentController;
