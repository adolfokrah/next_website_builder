import { SignJWT } from 'jose';
import { getJwtSecretKey } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma_init';
import { Md5 } from 'ts-md5';

export async function POST(req: Request) {
  const url = req.url.split('/');

  let path = url[url.length - 1];

  if (path === 'login') {
    const { email, password } = await req.json();

    if (email && password) {
      const user = await prisma.adminUser.findFirst({
        where: { email, password: Md5.hashStr(password) },
        select: {
          name: true,
          email: true,
          role: true,
          avatar: true,
        },
      });

      if (!user) {
        return Response.json({ error: 'Incorrect combination of username and password' });
      }

      const token = await new SignJWT({
        email,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5h')
        .sign(getJwtSecretKey());
      const response = NextResponse.json(
        { success: true },
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
      response.cookies.set({
        name: 'token',
        value: token,
        path: '/',
      });
      return response;
    } else {
      return Response.json({ error: 'Both username and password needed' });
    }
  }

  if (path === 'logout') {
    const response = NextResponse.json(
      { success: true },
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
    response.cookies.delete('token');
    return response;
  }

  if (path === 'apiKey') {
    return Response.json({ error: 'apk key route' });
  }
}

// await prisma.adminUser.create({
//   data:{email, password: Md5.hashStr(password), avatar: '', name:'Adolf', role: 'MAIN_ADMIN'}
// })
