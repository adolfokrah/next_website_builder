'use server';

import { Page } from '@prisma/client';
import prisma from '../prisma_init';
import { revalidatePath } from 'next/cache';
import { PageBlock } from '../types';

export const createNewPage = async ({ name, slug }: { name: Page['name']; slug: Page['slug'] }) => {
  try {
    const createdPage = await prisma.page.create({
      data: {
        name,
        slug: `${slug.split(' ').join('-')}`,
      },
    });
    prisma.$disconnect();
    return { data: createdPage, error: null };
  } catch (error) {
    return { error: 'Kindly ensure that the page name or slug does not already exist.' };
  }
};

export const updatePageSettings = async ({
  name,
  slug,
  metaTitle,
  metaKeyWords,
  metaDescription,
  id,
}: {
  id: Page['id'];
  name: Page['name'];
  slug: Page['slug'];
  metaTitle: Page['metaTitle'];
  metaKeyWords: Page['metaKeyWords'];
  metaDescription: Page['metaDescription'];
}) => {
  try {
    const createdPage = await prisma.page.update({
      where: {
        id,
      },
      data: {
        name,
        slug: `${slug.split(' ').join('-')}`,
        metaTitle,
        metaDescription,
        metaKeyWords,
      },
    });
    prisma.$disconnect();
    return { data: createdPage, error: null };
  } catch (error) {
    return { error: 'Kindly ensure that the page name or slug does not already exist.' };
  }
};

export const deletePage = async ({ id }: { id: Page['id'] }) => {
  try {
    let data = await prisma.page.delete({
      where: {
        id,
      },
    });
    prisma.$disconnect();
    revalidatePath('/');
    return { data: { data }, error: null };
  } catch (error) {
    return { error: 'Oops, something happened' };
  }
};

export const copyPage = async ({ id }: { id: Page['id'] }) => {
  try {
    let page = await prisma.page.findFirst({
      where: { id },
    });
    if (page) {
      let pageNumber = generateUniqueNumbers();
      const createdPage = await prisma.page.create({
        data: {
          name: `${page.name}-${pageNumber}`,
          slug: `${page.slug.split(' ').join('-')}-${pageNumber}`,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          metaKeyWords: page.metaKeyWords,
          blocks: page.blocks as object[],
        },
      });

      prisma.$disconnect();
      return { data: createdPage, error: null };
    }
  } catch (error) {
    return { error: 'Oops, something happened' };
  }
};

export const savePage = async ({ id, blocks }: { id: Page['id']; blocks: PageBlock[] }) => {
  try {
    const data = await prisma.page.update({
      where: {
        id,
      },
      data: {
        blocks: blocks.map((block) => ({ ...block, icon: '', component: '' })) as object[],
      },
    });

    prisma.$disconnect();
    return { data: data, error: null };
  } catch (error) {
    return { error: 'Oops, something happened' };
  }
};

function generateUniqueNumbers(): string {
  let numbers: number[] = [];
  while (numbers.length < 4) {
    let randomNumber = Math.floor(Math.random() * 10);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers.join('');
}
