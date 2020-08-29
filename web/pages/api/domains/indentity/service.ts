import { PrismaClient, Identity } from "@prisma/client";

const prisma = new PrismaClient();

export function createIdentity(
  identity: Omit<Identity, "id">
): Promise<Identity> {
  return prisma.identity.create({
    data: {
      name: identity.name,
    },
  });
}

export function deleteIdentity(identityId: number): Promise<Identity> {
  return prisma.identity.delete({
    where: {
      id: identityId,
    },
  });
}
