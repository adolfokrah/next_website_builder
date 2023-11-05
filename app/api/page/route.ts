import { Page, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { NextRequest } from 'next/server';


export async function PUT(req: Request) {
  const { slug, blocks }: Page = await req.json();

  const page = await prisma.page.update({
    where: {
      slug,
    },
    data: {
      blocks: JSON.parse(JSON.stringify(blocks)),
    },
  });

  prisma.$disconnect();
  return Response.json(page);
}

export async function GET(req: NextRequest) {
  let page = await prisma.page.findFirst({
    where: {
      slug: req.nextUrl.searchParams.get('page') || '',
    },
  });

  if (page) {
    page = { ...page, blocks: page?.blocks || [] };
  }
  prisma.$disconnect();

  return Response.json(page);
}

export async function POST(req: Request) {
 const { name, slug }: Page = await req.json();
 try {
  const createdPage = await prisma.page.create({
    data: {
      name,
      slug
    }
  });
   prisma.$disconnect();
   return Response.json(createdPage);
  } catch (error) {
   return Response.json(error);
  }
}


export async function PATCH(req: Request) {
  const { slug, metaTitle, metaDescription, metaKeyWords, featuredImage }: Page = await req.json();

  const page = await prisma.page.update({
    where: {
      slug,
    },
    data: {
      metaTitle,
      metaDescription,
      metaKeyWords,
      featuredImage,
      blocks: []
    },
  });

  prisma.$disconnect();
  return Response.json(page);
}