import { PrismaClient, Photo } from "@prisma/client";
import * as path from "path";
import MessageBroker from "../../utils/MessageBroker";
import { scanDir } from "../../utils/FileSystem";

const prisma = new PrismaClient();

export async function createPhotoIfNotExist(
  path: string
): Promise<Photo | null> {
  const existingPhoto = await prisma.photo.findOne({
    where: {
      path,
    },
  });
  if (!existingPhoto) {
    return createPhoto(path);
  }
}

export async function createPhoto(path: string): Promise<Photo> {
  const photo = await prisma.photo.create({
    data: {
      path,
    },
  });
  const broker = await MessageBroker.getInstance();
  await broker.sendJson("FaceDetectionRequest", {
    photoId: photo.id,
    photoPath: photo.path,
  });
  return photo;
}

export async function scanPhotos(): Promise<void> {
  const photoExtension = ".jpg";
  const basePath = path.resolve(process.env.IMAGES_FOLDER);

  const photoPaths = scanDir(basePath).filter((p) =>
    p.endsWith(photoExtension)
  );

  await photoPaths.map((path) => {
    createPhotoIfNotExist(path);
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
