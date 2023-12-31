import prisma from '@/lib/prisma_init';
import { cookies } from 'next/headers';
export async function GET(request: Request, { params }: { params: { slug: string; projectId: string } }) {
  const { slug, projectId } = params;

  const cookieStore = cookies();
  const token = cookieStore.get('token');

  //check if project exists
  try {
    let project = await prisma.project.findFirst({ where: { id: projectId } });
    if (!project) {
      return Response.json({ error: 'Project not found', projectId }, { status: 401 });
    }

    let page = await prisma.page.findFirst({
      where: {
        slug: `/${slug}`,
        projectId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        metaDescription: true,
        metaTitle: true,
        metaKeyWords: true,
        featuredImage: true,
      },
    });

    let pages = await prisma.page.findMany({
      select: { name: true, slug: true, id: true, status: true },
      where: {
        projectId,
      },
    });

    let admin;
    if (token) {
      const { email } = JSON.parse(Buffer.from(token.value.split('.')[1], 'base64').toString());
      let user = await prisma.adminUser.findFirst({
        where: { email },
      });
      if (user) {
        admin = JSON.parse(JSON.stringify(user));
      }
    }

    return Response.json({ page, admin, pages });
  } catch (e) {
    return Response.json({ error: 'Ops! an error occurred on our side' }, {status: 401});
  }
}
