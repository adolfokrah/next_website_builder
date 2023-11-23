
import prisma from '@/lib/prisma_init';
import { generateUniqueNumbers } from '@/lib/utils';
import { PageStatus } from '@prisma/client';
import { PageBlock } from 'visio-cms';


export async function POST(req: Request) {
 const { name, slug, id } = await req.json();
 if(!id){
     const whiteListSlugs = ['/404', '/builder/sign-in', '/builder/sign-up', '/builder/lost-password'];
  try {
    if (whiteListSlugs.includes(slug)) {
       return Response.json( { error: `slug ${slug} is a reserved page` }) 
    }
    const createdPage = await prisma.page.create({
      data: {
        name,
        slug: `${slug.split(' ').join('-')}`,
        status: PageStatus.DRAFT,
      },
    });
    prisma.$disconnect();
     return Response.json( { data: createdPage, error: null }) 
  } catch (error) {
    return Response.json( { error: 'Kindly ensure that the page name or slug does not already exist.' }) 
  }
 }else{
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
          blocks: JSON.parse(JSON.stringify(page.blocks)) ,
          status: page.status || PageStatus.DRAFT,
        },
      });
      prisma.$disconnect();
       return Response.json({ data: createdPage, error: null }) 
    }
  } catch (error) {
     return Response.json({ error: 'Oops, something happened' }) 
  } 
 }
}

export async function PATCH(req: Request) {
  const {
  name,
  slug,
  metaTitle,
  metaKeyWords,
  metaDescription,
  id,
} = await req.json();

  try {
    if (slug == '/404') {
       return Response.json({ error: 'slug 404 is a reserved page' }) 
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
     return Response.json({ data: updatedPage, error: null }) 
  } catch (error) {
      return Response.json({ error: 'Kindly ensure that the page name or slug does not already exist.' }) 
  }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
    let data = await prisma.page.delete({
      where: {
        id,
      },
    });
    prisma.$disconnect();
    
     return Response.json({ data: { data }, error: null }) 
  } catch (error) {
     return Response.json({ error: 'Oops, something happened' }) 
  }
}



export async function PUT(req: Request) {
    const { id, blocks, status } = await req.json();
    try {
    const page = await prisma.page.update({
      where: {
        id,
      },
      data: {
        blocks: blocks.map((block:PageBlock) => ({
          id: block.id,
          key: block.key,
          inputs: block.inputs,
          globalId: block?.globalId,
        })) as object,
        status,
      },
    });

    prisma.$disconnect();
    
     return Response.json({ data: page, error: null }) 
  } catch (error) {
     return Response.json({ error: 'Oops, something happened' }) 
  }
}

