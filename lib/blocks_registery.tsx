import { Component } from '@/lib/types';
import Hero from '@/components/ui/hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FileIcon, HamburgerMenuIcon, ImageIcon, LayersIcon, SunIcon } from '@radix-ui/react-icons';
import ContactForm from '@/components/ui/contact-form';
import Metrics from '@/components/ui/metics';

const registeredComponents: Component[] = [
  {
    component: Button,
    title: 'Button',
    icon: <ImageIcon />,
    defaultInputs: { children: 'button' },
    props: [{ name: 'children', type: 'text', label: 'Title' }],
  },
  {
    component: Input,
    title: 'Text input',
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
      { name: 'subTitle', type: 'text', label: 'Sub title' },
      { name: 'color', type: 'text', label: 'Title color' },
      { name: 'initialCount', type: 'number', label: 'Initial count' },
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
];

export default registeredComponents;
