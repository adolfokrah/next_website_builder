import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { NextRequest } from "next/server";

type UpdatePageI = {
    name: string
    components: object
}
export async function PUT(req: Request) {
  const { name, components } : UpdatePageI = await req.json()
 
  const page = await prisma.page.update({
    where: {
      name
    },
    data: {
      name,
      components: JSON.stringify(components)
    }
  })

   prisma.$disconnect();
   return Response.json(page)
 
}

export async function GET(req: NextRequest){
    let page = await prisma.page.findFirst({
      where: {
        name: req.nextUrl.searchParams.get('page') || ""
      }
    })

    
    if(page){
      page = {...page, 
       components: JSON.parse(page?.components || "[]")}
    }
   
  

   return Response.json(page)
}