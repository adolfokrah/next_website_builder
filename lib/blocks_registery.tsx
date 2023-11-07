import { Block } from '@/lib/types';
import Hero from '@/components/ui/hero';

import { FileIcon, HamburgerMenuIcon, ImageIcon, LayersIcon, SunIcon } from '@radix-ui/react-icons';
import ContactForm from '@/components/ui/contact-form';
import Metrics from '@/components/ui/metics';
import Header from '@/components/ui/header';
import { Box, Grid, SheetIcon } from 'lucide-react';
import WorkWithUs from '@/components/ui/work-with-us';
import Collections from '@/components/ui/collections';
import Features from '@/components/ui/features';
import NewsLetter from '@/components/ui/newsLetter';

const registerBlocks: Block[] = [
  {
    component: WorkWithUs,
    title: 'Work with us',
    icon: <ImageIcon />,
    defaultInputs: { children: 'button' },
    props: [{ name: 'children', type: 'text', label: 'Title' }],
  },
  {
    component: Collections,
    title: 'Collections',
    icon: <SunIcon />,
    defaultInputs: { placeholder: 'first name' },
    props: [{ name: 'placeholder', type: 'text', label: 'Placeholder' }],
  },
  {
    component: Hero,
    title: 'Hero',
    icon: <LayersIcon />,
    defaultInputs: {
      title: 'This is a hero',
      subTitle:
        'Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started',
      color: '#FFFFFF',
      initialCount: 0,
    },
    props: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subTitle', type: 'textArea', label: 'Sub title' },
      { name: 'color', type: 'colorSetter', label: 'Set Color' },
      { name: 'initialCount', type: 'number', label: 'Initial count' },
      { name: 'images', type: 'text', label: 'Images' },
    ],
  },
  {
    component: ContactForm,
    title: 'Contact form',
    icon: <FileIcon />,
    defaultInputs: {
      emailLabel: 'Email',
      emailPlaceHolder: 'Enter your email',
      messageLabel: 'Message',
      messagePlaceHolder: 'Enter message here',
      title: 'Contact us',
      subTitle: 'Get in touch with us with just a message',
      buttonText: 'Send message',
    },
    props: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subTitle', type: 'text', label: 'Sub title' },
      { name: 'emailLabel', type: 'text', label: 'Email label' },
      { name: 'emailPlaceHolder', type: 'text', label: 'Email placeholder' },
      { name: 'messageLabel', type: 'text', label: 'Message Label' },
      {
        name: 'messagePlaceHolder',
        type: 'text',
        label: 'Message placeholder',
      },
      {
        name: 'buttonText',
        type: 'text',
        label: 'Button text',
      },
    ],
  },
  {
    component: Metrics,
    title: 'metics',
    icon: <HamburgerMenuIcon />,
    defaultInputs: {},
  },
  {
    component: Header,
    title: 'Nav bar',
    icon: <Box />,
    defaultInputs: {},
  },
  {
    component: Features,
    title: 'Features',
    icon: <Grid />,
    defaultInputs: {},
  },
  {
    component: NewsLetter,
    title: 'News letter',
    icon: <SheetIcon />,
    defaultInputs: {},
  },
];

export default registerBlocks;
