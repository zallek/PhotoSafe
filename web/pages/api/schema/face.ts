import { objectType, intArg, mutationField } from "@nexus/schema";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Face = objectType({
  name: "Face",
  definition(t) {
    t.int("id");
    t.int("x");
    t.int("y");
    t.int("h");
    t.int("w");
    t.field("photo", {
      type: "Photo",
      resolve: (parent) => {
        return prisma.face
          .findOne({
            where: {
              id: parent.id,
            },
          })
          .photo();
      },
    });
    t.field("identity", {
      type: "Identity",
      nullable: true,
      resolve: (parent) => {
        return prisma.face
          .findOne({
            where: {
              id: parent.id,
            },
          })
          .identity();
      },
    });
  },
});

export const createFace = mutationField("createFace", {
  args: {
    x: intArg({ nullable: false }),
    y: intArg({ nullable: false }),
    w: intArg({ nullable: false }),
    h: intArg({ nullable: false }),
    photoId: intArg({ nullable: false }),
  },
  type: "Face",
  resolve: async (parent, args, ctx) => {
    return prisma.face.create({
      data: {
        x: args.x,
        y: args.y,
        w: args.w,
        h: args.h,
        photo: {
          connect: {
            id: args.photoId,
          },
        },
      },
    });
  },
});

export const identityFace = mutationField("identifyFace", {
  args: {
    faceId: intArg({ nullable: false }),
    identityId: intArg({ nullable: false }),
  },
  type: "Face",
  resolve: (parent, args, ctx) => {
    return prisma.face.update({
      where: {
        id: args.faceId,
      },
      data: {
        identity: {
          connect: {
            id: args.identityId,
          },
        },
      },
    });
  },
});

export const deleteFace = mutationField("deleteFace", {
  args: {
    faceId: intArg({ nullable: false }),
  },
  type: "Face",
  resolve: async (parent, args, ctx) => {
    return prisma.face.delete({
      where: {
        id: args.faceId,
      },
    });
  },
});
