'use client';
import { RenderBlockControllerProps } from '@/lib/types';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { useBuilderState } from '@/lib/useBuilderState';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '../../checkbox';

const LinkController = ({ prop, propIndex, defaultValue, handlePropValueChange }: RenderBlockControllerProps) => {
  const { pages } = useBuilderState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue?.url || '');
  const [openAsNewWindow, setOpenAsNewWindow] = useState<boolean>(defaultValue?.target === '_blank');
  const [search, setSearch] = useState('');

  const isValidUrl = (url: string) => {
    const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
  };

  const addLink = () => {
    setValue(search);
    setOpen(false);
    handleChange(search);
  };

  const handleChange = (url: string) => {
    handlePropValueChange({ url, target: openAsNewWindow ? '_blank' : '_self' }, propIndex, prop);
  };

  useEffect(() => {
    handleChange(value);
  }, [openAsNewWindow]);

  const linkLabel = value ? pages.find((page) => page.slug === value || page.name === value)?.name || value : null;

  return (
    <TooltipProvider>
      <div>
        <label className=" text-xs font-semibold">{prop.label}</label>
        <div className="mt-2 mb-2">
          <Popover open={open} onOpenChange={setOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-[35px]"
                  >
                    {value
                      ? linkLabel && linkLabel?.length > 30
                        ? `${linkLabel?.substring(0, 30)}...`
                        : linkLabel
                      : 'Select or add new page'}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent align="center">
                <p>{linkLabel}</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent className="w-[280px] p-0 ">
              <Command>
                <CommandInput
                  placeholder="Search or type eg. https://mypage.com"
                  className="h-9"
                  onValueChange={setSearch}
                />
                <CommandEmpty>
                  {isValidUrl(search) ? (
                    <Button variant={'outline'} onClick={addLink}>
                      Add link
                    </Button>
                  ) : (
                    'Link not found'
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-auto">
                  {pages.map((page) => (
                    <CommandItem
                      key={page.slug}
                      value={page.slug}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                        handleChange(page.slug);
                      }}
                      className="cursor-pointer"
                    >
                      {page.name}
                      <CheckIcon className={cn('ml-auto h-4 w-4', value === page.slug ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2 my-4 pl-2">
          <Checkbox
            id="_blank"
            checked={openAsNewWindow}
            onCheckedChange={() => setOpenAsNewWindow((prevState) => !prevState)}
          />
          <label
            htmlFor="_blank"
            className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Open as new window
          </label>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LinkController;
