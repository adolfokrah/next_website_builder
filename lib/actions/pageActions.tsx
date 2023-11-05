'use server';

import { Page } from '@prisma/client';
import prisma from '../prisma_init';
import { revalidatePath } from 'next/cache';

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
