import { ImageT, RenderBlockControllerProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '../../button';
import { PlusIcon, ReplaceIcon, Trash2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import MediaLibrary from '../mediaLibrary';
import Image from 'next/image';
import { Input } from '../../input';

const ImageUploader = ({ prop, propIndex, defaultValue, handlePropValueChange }: RenderBlockControllerProps) => {
  const [image, setImage] = useState<ImageT | undefined>(defaultValue);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    handlePropValueChange(image, propIndex, prop);
  }, [image]);

  return (
    <>
      <div>
        <label className=" text-xs font-semibold">{prop.label}</label>
        <div className="w-full h-52 rounded-md border mt-2 border-slate-200 flex items-center justify-center gap-2 relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'outline'}
                  className="rounded-full p-0 h-10 w-10 relative z-10 bg-white"
                  onClick={() => setOpenDialog(true)}
                >
                  {!image && <PlusIcon size={17} />}
                  {image && <ReplaceIcon size={17} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center">
                <p>{image ? 'Change Image' : 'Upload Image'}</p>
              </TooltipContent>
            </Tooltip>

            {image && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="rounded-full p-0 h-10 w-10 relative z-10 bg-white"
                    onClick={() => setImage(undefined)}
                  >
                    <Trash2Icon size={17} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="center">
                  <p>Delete Image</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>

          {image && (
            <Image
              loading="lazy"
              src={image?.url || ''}
              sizes="100%"
              alt="no-alt"
              fill
              className="absolute w-full h-full object-contain"
            />
          )}
        </div>
        {image && (
          <Input
            className="mt-2"
            placeholder="alt"
            defaultValue={image?.alt || ''}
            onChange={(e) => setImage({ ...image, alt: e.target.value })}
          />
        )}
      </div>

      <MediaLibrary open={openDialog} setOpen={setOpenDialog} onChange={setImage} selectedImageUrl={image?.url} />
    </>
  );
};

export default ImageUploader;
