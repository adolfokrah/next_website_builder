import registeredBlocks from '@/blocks/blocks_registery';
import { Page } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface BuilderPageProps {
  data: Page['blocks'];
}

const RenderBuilderContent = async ({ data }: BuilderPageProps) => {
  let content: Page['blocks'] = data;
  if (content) {
    let pageBlocks = content.map((block: any) => {
      let foundComponent = registeredBlocks.find((c) => c.key === block.key);
      return {
        ...foundComponent,
        selected: false,
        inputs: block.inputs,
        id: uuidv4(),
      };
    });

    return (
      <>
        {pageBlocks.map((block) => {
          const Tag = block.component;
          const inputs = block.inputs || block.defaultInputs;
          return <section key={uuidv4()}>{Tag ? <Tag {...inputs} /> : null}</section>;
        })}
      </>
    );
  }
  return <div>page not found</div>;
};

export default RenderBuilderContent;
