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
    props: [{ name: 'backgroundImage', type: 'image', label: 'Background Image' }],
    key: 'workWithUs',
  },
  {
    component: Collections,
    title: 'Collections',
    icon: <SunIcon />,
    defaultInputs: { collections: [], title: 'Collections' },
    props: [
      { type: 'text', label: 'Tittle', name: 'title' },
      {
        name: 'collections',
        type: 'list',
        label: 'Collections',
        listDisplayedLabels: {
          title: 'title',
          caption: 'headline',
          image: 'image',
        },
        schema: [
          { type: 'text', label: 'Tittle', name: 'title' },
          { type: 'text', label: 'HeadLine', name: 'headline' },
          { type: 'text', label: 'Link', name: 'link' },
          { type: 'image', label: 'Image', name: 'image' },
        ],
      },
    ],
    key: 'collections',
  },
  {
    component: Hero,
    title: 'Hero',
    icon: <LayersIcon />,
    key: 'hero',
    defaultInputs: {
      title: 'This is a hero',
      subTitle:
        'Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started',
      color: '#FFFFFF',
      initialCount: 0,
      image: {
        path: '',
        width: 100,
        height: 200,
        alt: 'helle world',
        url: 'https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg',
      },
    },
    props: [
      { name: 'title', type: 'text', label: 'Title' },
      { name: 'subTitle', type: 'textArea', label: 'Sub title' },
      { name: 'color', type: 'colorPicker', label: 'Button Color' },
      { name: 'backgroundColor', type: 'colorPicker', label: 'Background Color' },
      { name: 'initialCount', type: 'number', label: 'Initial count' },
      { name: 'image', type: 'image', label: 'Background image' },
    ],
  },
  {
    component: ContactForm,
    title: 'Contact form',
    icon: <FileIcon />,
    key: 'contactForm',
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
    title: 'Metrics',
    key: 'metrics',
    icon: <HamburgerMenuIcon />,
    defaultInputs: {
      metrics: [
        { figure: '$119 trillion', caption: 'Assets under holding', key: 'caption2' },
        { figure: '44 million', caption: 'Transactions every 24 hours', key: 'caption3' },
        { figure: '46,000', caption: 'New users annually', key: 'caption5' },
      ],
    },
    props: [
      {
        name: 'metrics',
        type: 'list',
        label: 'Items',
        listDisplayedLabels: {
          title: 'figure',
          caption: 'caption',
        },
        schema: [
          { type: 'text', label: 'Figure', name: 'figure' },
          { type: 'text', label: 'Caption', name: 'caption' },
        ],
      },
    ],
  },
  {
    component: Header,
    title: 'Nav bar',
    key: 'navBar',
    icon: <Box />,
    defaultInputs: { navigation: [], logo: {} },
    props: [
      { type: 'image', name: 'logo', label: 'Logo' },
      {
        type: 'list',
        name: 'navigation',
        label: 'Navigation',
        listDisplayedLabels: {
          title: 'name',
          caption: 'href',
        },
        schema: [
          { type: 'text', name: 'name', label: 'Name' },
          { type: 'text', name: 'href', label: 'Link' },
        ],
      },
    ],
  },
  {
    component: Features,
    title: 'Features',
    icon: <Grid />,
    defaultInputs: {},
    key: 'features',
  },
  {
    component: NewsLetter,
    title: 'News letter',
    key: 'newsLetter',
    icon: <SheetIcon />,
    defaultInputs: {},
  },
];

export default registerBlocks;
