'use server';

import { Page, PageStatus } from '@prisma/client';
import prisma from '../prisma_init';
import { revalidatePath } from 'next/cache';
import { GlobalBlock, PageBlock } from 'visio-cms';

export const createNewPage = async ({ name, slug }: { name: Page['name']; slug: Page['slug'] }) => {
  const whiteListSlugs = ['/404', '/builder/sign-in', '/builder/sign-up', '/builder/lost-password'];
  try {
    if (whiteListSlugs.includes(slug)) {
      return { error: `slug ${slug} is a reserved page` };
    }
    const createdPage = await prisma.page.create({
      data: {
        name,
        slug: `${slug.split(' ').join('-')}`,
        status: PageStatus.DRAFT,
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
    if (slug == '/404') {
      return { error: 'slug 404 is a reserved page' };
    }
    const updatedPage = await prisma.page.update({
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
    return { data: updatedPage, error: null };
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

export const duplicatePage = async ({ id }: { id: Page['id'] }) => {
  // try {
  //   let page = await prisma.page.findFirst({
  //     where: { id },
  //   });
  //   if (page) {
  //     let pageNumber = generateUniqueNumbers();
  //     const createdPage = await prisma.page.create({
  //       data: {
  //         name: `${page.name}-${pageNumber}`,
  //         slug: `${page.slug.split(' ').join('-')}-${pageNumber}`,
  //         metaTitle: page.metaTitle,
  //         metaDescription: page.metaDescription,
  //         metaKeyWords: page.metaKeyWords,
  //         blocks: page.blocks as GlobalBlock[],
  //         status: page.status || PageStatus.DRAFT,
  //       },
  //     });
  //     prisma.$disconnect();
  //     return { data: createdPage, error: null };
  //   }
  // } catch (error) {
  //   return { error: 'Oops, something happened' };
  // }
};

export const savePage = async ({ id, blocks, status }: { id: Page['id']; blocks: PageBlock[]; status: PageStatus }) => {
  try {
    const page = await prisma.page.update({
      where: {
        id,
      },
      data: {
        blocks: blocks.map((block) => ({
          id: block.id,
          key: block.key,
          inputs: block.inputs,
          globalId: block?.globalId,
        })) as object,
        status,
      },
    });

    prisma.$disconnect();
    revalidatePath('/');
    return { data: page, error: null };
  } catch (error) {
    console.log(error);
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
