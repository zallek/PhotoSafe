import { PrismaClient, Face } from "@prisma/client";
import MessageBroker from "../../utils/MessageBroker";

const prisma = new PrismaClient();

export async function createFace(face: Omit<Face, "id">): Promise<Face> {
  return prisma.face.create({
    data: {
      x: face.x,
      y: face.y,
      w: face.w,
      h: face.h,
      photo: {
        connect: {
          id: face.photoId,
        },
      },
    },
  });
}

export async function identifyFace(
  faceId: number,
  identityId: number
): Promise<Face> {
  return await prisma.face.update({
    where: {
      id: faceId,
    },
    data: {
      identity: {
        connect: {
          id: identityId,
        },
      },
    },
  });
}

export async function deleteFace(faceId: number): Promise<Face> {
  return prisma.face.delete({
    where: {
      id: faceId,
    },
  });
}
