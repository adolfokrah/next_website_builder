'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../prisma_init';

export const saveFileDetails = async ({ url, width, height }: { url: string; width: number; height: number }) => {
  let data = {
    name: '',
    width,
    height,
    url,
  };

  try {
    const createdFile = await prisma.file.create({
      data,
    });
    prisma.$disconnect();

    return { data: createdFile, error: null };
  } catch (error) {
    throw { error: 'An error occurred' };
  }
};

export const deleteFileDetails = async ({ id }: { id: string }) => {
  try {
    let data = await prisma.file.delete({
      where: {
        id,
      },
    });
    prisma.$disconnect();
    return { data: { data }, error: null };
    revalidatePath('/');
  } catch (error) {
    throw { error: 'Oops, something happened' };
  }
};

export const getAllFilesDetails = async () => {
  try {
    let data = await prisma.file.findMany({ select: { id: true, width: true, height: true, url: true } });
    prisma.$disconnect();
    return { data, error: null };
  } catch (error) {
    throw { error: 'Oops, something happened' };
  }
};
