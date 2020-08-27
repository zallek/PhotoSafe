import * as fs from "fs";
import * as path from "path";
import { PrismaClient, Photo } from "@prisma/client";

const prisma = new PrismaClient();

const basePath = path.resolve("public/photos");
const photoExtension = ".jpg";

export async function scanPhotos(): Promise<void> {
  const photoPaths = scanDir(basePath).filter((p) =>
    p.endsWith(photoExtension)
  );

  await photoPaths.map((path) => {
    registerPhotoIfNotExist(path);
  });

  await prisma.photo.deleteMany({
    where: {
      NOT: {
        OR: photoPaths.map((p) => ({
          path: p,
        })),
      },
    },
  });
}

async function registerPhotoIfNotExist(path: string): Promise<Photo | null> {
  const existingPhoto = await prisma.photo.findOne({
    where: {
      path,
    },
  });
  if (!existingPhoto) {
    return registerPhoto(path);
  }
}

async function registerPhoto(path: string): Promise<Photo> {
  return prisma.photo.create({
    data: {
      path,
    },
  });
}

function scanDir(basePath: string, subPath: string = ""): string[] {
  const fullPath = path.join(basePath, subPath);
  if (fs.statSync(fullPath).isDirectory()) {
    const subPaths = fs.readdirSync(fullPath);
    return subPaths.map((p) => scanDir(basePath, path.join(subPath, p))).flat();
  }
  return [subPath];
}
