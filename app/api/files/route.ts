import prisma from '@/lib/prisma_init';
import { v2 as cloudinary } from 'cloudinary'

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const createdFile = await prisma.file.create({
      data,
    });
    prisma.$disconnect();
    return Response.json(createdFile);
  } catch (error) {
    console.log(error)
    return Response.json({ error: 'An error occurred' });
  }
}

export async function GET() {
    try {
  
    let data = await prisma.file.findMany({ select: { id: true, width: true, height: true, url: true, name: true, cloudinaryImageId: true, bytes: true }, orderBy: {createdAt: 'desc'} });
    prisma.$disconnect();
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: 'Oops, something happened' });
  }
}

export async function DELETE(req: Request) {
    const { id, cloudinaryImageId } = await req.json();
      console.log(cloudinaryImageId)
     try {
        if(cloudinaryImageId){
          await cloudinary.api.delete_resources([cloudinaryImageId], { type: 'upload', resource_type: 'image' })
        }

        let data = await prisma.file.delete({
        where: {
            id,
        },
        });
        prisma.$disconnect();
        return Response.json({ data});
    } catch (error) {
        return Response.json({ error: 'Oops, something happened' });
    }
}