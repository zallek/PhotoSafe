import { objectType, intArg, queryField, mutationField } from "@nexus/schema";
import { PrismaClient } from "@prisma/client";
import { scanPhotos } from "./service";

const prisma = new PrismaClient();

export const Photo = objectType({
  name: "Photo",
  definition(t) {
    t.int("id");
    t.string("path");
    t.string("url", {
      resolve: (parent) => {
        return `${process.env.IMAGES_HOST}/${parent.path}`;
      },
    });
    t.list.field("faces", {
      type: "Face",
      resolve: (parent) => {
        return prisma.photo
          .findOne({
            where: {
              id: parent.id,
            },
          })
          .faces();
      },
    });
  },
});

export const photoQuery = queryField("photo", {
  type: "Photo",
  args: {
    photoId: intArg({ nullable: false }),
  },
  resolve: (parent, args, ctx) => {
    return prisma.photo.findOne({
      where: {
        id: args.photoId,
      },
    });
  },
});

export const photosQuery = queryField("photos", {
  type: "Photo",
  list: true,
  args: {
    identityId: intArg(),
  },
  resolve: (parent, args, ctx) => {
    var wherePayload = {};
    if (args.identityId) {
      wherePayload = {
        where: {
          faces: {
            some: {
              identityId: args.identityId,
            },
          },
        },
      };
    }
    return prisma.photo.findMany({
      ...wherePayload,
    });
  },
});

export const scanPhotosMutation = mutationField("scanPhotos", {
  type: "Boolean",
  resolve: async (parent, args, ctx) => {
    await scanPhotos();
    return true;
  },
});
