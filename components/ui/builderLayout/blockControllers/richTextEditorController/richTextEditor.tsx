'use client';

import { RenderBlockControllerProps } from '@/lib/types';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './menubar';
import Underline from '@tiptap/extension-underline';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';

const RichTextEditorController = ({
  prop,
  propIndex,
  defaultValue,
  handlePropValueChange,
}: RenderBlockControllerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Paragraph,
      Blockquote,
      TextStyle,
      Strike,
      Image,
      CodeBlock,
      Color,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      handlePropValueChange(editor.getHTML(), propIndex, prop);
    },
  });

  if (!editor) return null;

  return (
    <div className="text-editor ">
      <label className=" text-xs font-semibold">{prop.label}</label>
      <div className="border border-slate-200 rounded-sm p-1 mt-2 ">
        <MenuBar editor={editor} />
        <div className=" h-72 overflow-auto">
          <EditorContent editor={editor} className="mb-3 mt-1 h-[95%]" />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditorController;
