import { Editor } from '@tiptap/react';
import {
  Menubar,
  MenubarContent,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/builderComponents/ui/menubar';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  ImageIcon,
  ItalicIcon,
  Link,
  List,
  ListOrderedIcon,
  MoreHorizontal,
  QuoteIcon,
  TextCursor,
  UnderlineIcon,
} from 'lucide-react';
import { cn, isValidImageUrl, isValidUrl } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/builderComponents/ui/popover';
import { Input } from '@/builderComponents/ui/input';
import { Button } from '@/builderComponents/ui/button';
import { useState } from 'react';
import { CompactPicker } from 'react-color';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/builderComponents/ui/tooltip';

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [linkUrl, setLinkUrl] = useState<string>('');
  return (
    <>
      <TooltipProvider>
        <Menubar className="flex gap-0 flex-row border-0 my-2 shadow-none">
          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.isActive('bold'),
                  })}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <BoldIcon size={13} />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">
                <p>Bold</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>

          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.isActive('italic'),
                  })}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <ItalicIcon size={13} />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">
                <p>Italic</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>

          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.isActive('underline'),
                  })}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon size={13} />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">
                <p>Underline</p>
              </TooltipContent>
            </Tooltip>
          </MenubarMenu>

          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger className="px-1 cursor-pointer text-brand-green-50 bg-slate-200">
                  {editor.isActive('heading', { level: 1 }) && <Heading1 size={13} />}
                  {editor.isActive('heading', { level: 2 }) && <Heading2 size={13} />}
                  {editor.isActive('heading', { level: 3 }) && <Heading3 size={13} />}
                  {editor.isActive('heading', { level: 4 }) && <Heading4 size={13} />}
                  {editor.isActive('paragraph') && <TextCursor size={13} />}
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">{editor.isActive('paragraph') ? 'Paragraph' : 'Heading'}</TooltipContent>
            </Tooltip>

            <MenubarContent>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('paragraph'),
                })}
                onClick={() => editor.chain().focus().setParagraph().run()}
              >
                Paragraph
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('heading', { level: 1 }),
                })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                Heading 1
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('heading', { level: 2 }),
                })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                Heading 2
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('heading', { level: 3 }),
                })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                Heading 3
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('heading', { level: 4 }),
                })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              >
                Heading 4
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="px-1 h-full !bg-white">
              <div className="h-[70%] w-[1px] bg-slate-200" />
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.isActive('bulletList'),
                  })}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List size={13} />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">Bullet list</TooltipContent>
            </Tooltip>
          </MenubarMenu>

          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.isActive('orderedList'),
                  })}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                  <ListOrderedIcon size={13} />
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">Numbered list</TooltipContent>
            </Tooltip>
          </MenubarMenu>

          <MenubarMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <MenubarTrigger className="px-1 cursor-pointer">
                  {editor.isActive({ textAlign: 'left' }) && <AlignLeft size={13} />}
                  {editor.isActive({ textAlign: 'right' }) && <AlignRight size={13} />}
                  {editor.isActive({ textAlign: 'center' }) && <AlignCenter size={13} />}
                  {editor.isActive({ textAlign: 'justify' }) && <AlignJustify size={13} />}
                </MenubarTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">Alignment</TooltipContent>
            </Tooltip>

            <MenubarContent>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive({ textAlign: 'left' }),
                })}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
              >
                Align left
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive({ textAlign: 'center' }),
                })}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
              >
                Align center
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive({ textAlign: 'right' }),
                })}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
              >
                Align right
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive({ textAlign: 'justify' }),
                })}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              >
                Justify
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="px-1 h-full !bg-white">
              <div className="h-[70%] w-[1px] bg-slate-200" />
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <Popover>
              <PopoverTrigger asChild>
                <MenubarTrigger className={cn('px-1 cursor-pointer')}>
                  <ImageIcon size={13} />
                </MenubarTrigger>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Input placeholder="Image Url" onChange={(e) => setImageUrl(e.target.value)} />
                <Button
                  className="w-full mt-2"
                  disabled={!isValidImageUrl(imageUrl)}
                  onClick={() => {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                    setImageUrl('');
                  }}
                >
                  Insert Image
                </Button>
              </PopoverContent>
            </Popover>
          </MenubarMenu>

          <MenubarMenu>
            <Popover>
              <PopoverTrigger
                asChild
                onClick={() => {
                  const previousUrl = editor.getAttributes('link').href;
                  setLinkUrl(previousUrl);
                  console.log(previousUrl);
                }}
              >
                <MenubarTrigger className={cn('px-1 cursor-pointer')}>
                  <Link size={13} />
                </MenubarTrigger>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Input
                  placeholder="eg. https://mylink.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <div className="mt-2 flex  justify-between">
                  <Button
                    className={cn('w-full ', {
                      'w-1/2': isValidUrl(linkUrl),
                    })}
                    disabled={!isValidUrl(linkUrl)}
                    onClick={() => {
                      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
                      setLinkUrl('');
                    }}
                  >
                    Insert Link
                  </Button>

                  {isValidUrl(linkUrl) && (
                    <Button
                      variant={'outline'}
                      className="w-[45%]"
                      onClick={() => {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                        setLinkUrl('');
                      }}
                    >
                      Remove Url
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="px-1 cursor-pointer">
              <MoreHorizontal size={13} />
            </MenubarTrigger>

            <MenubarContent>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('blockquote'),
                })}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                Blockquote
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('strike'),
                })}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                Strike through
              </MenubarItem>
              <MenubarItem
                className={cn('px-1 cursor-pointer', {
                  'text-brand-green-50 bg-slate-200': editor.isActive('codeBlock'),
                })}
                onClick={() => {
                  editor.chain().focus().toggleCodeBlock().run();
                }}
              >
                Code block
              </MenubarItem>

              <MenubarSub>
                <MenubarSubTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.getAttributes('textStyle').color,
                  })}
                >
                  Text Color
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem className="!bg-white p-0">
                    <CompactPicker
                      color={editor.getAttributes('textStyle').color}
                      onChange={(color) => {
                        editor.chain().focus().setColor(color.hex).run();
                      }}
                    />
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>

              <MenubarSub>
                <MenubarSubTrigger
                  className={cn('px-1 cursor-pointer', {
                    'text-brand-green-50 bg-slate-200': editor.isActive('highlight'),
                  })}
                >
                  Highlight text
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem className="!bg-white p-0">
                    <CompactPicker
                      color={editor.getAttributes('textStyle').color}
                      onChange={(color) => {
                        editor.chain().focus().toggleHighlight({ color: color.hex }).run();
                      }}
                    />
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </TooltipProvider>
    </>
  );
};

export default MenuBar;
