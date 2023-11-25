import { encryptApiKey } from '@/lib/auth';
import prisma from '@/lib/prisma_init';
import { AdminStatus, Role } from '@prisma/client';
import { Md5 } from 'ts-md5';

export async function POST(req: Request) {
  const data = await req.json();
  try {
    // Create the admin user
    const createdUser = await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        password: Md5.hashStr(data.password), // Ensure this is the MD5 hash of the password
        status: AdminStatus.ACTIVE,
        apiKey: encryptApiKey(data.email),
        role: Role.MAIN_ADMIN,
        organization: {
          create: {
            name: data.organizationName,
          },
        },
      },
    });
    prisma.$disconnect();
    return Response.json(createdUser);
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'An error occurred' });
  }
}
