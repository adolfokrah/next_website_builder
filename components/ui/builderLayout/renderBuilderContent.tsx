import registeredComponents from '@/lib/component_registery';
import { v4 as uuidv4 } from 'uuid';

interface BuilderPageProps {
  data: string;
}

const RenderBuilderContent = async ({ data }: BuilderPageProps) => {
  let content: object[] = JSON.parse(data || '[]');
  if (content.length) {
    let components = content.map((component: any) => {
      let foundComponent = registeredComponents.find((c) => c.title === component.component);
      return {
        ...foundComponent,
        selected: false,
        inputs: component.inputs,
        id: uuidv4(),
      };
    });

    return (
      <>
        {components.map((component) => {
          const Tag = component.component;
          const inputs = component.inputs || component.defaultInputs;
          return <section key={component.id}>{Tag ? <Tag {...inputs} /> : null}</section>;
        })}
      </>
    );
  }
  return <div>page not found</div>;
};

export default RenderBuilderContent;
