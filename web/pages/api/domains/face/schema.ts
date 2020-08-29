import { objectType, intArg, mutationField } from "@nexus/schema";
import { PrismaClient } from "@prisma/client";
import { createFace, identifyFace, deleteFace } from "./service";

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

export const createFaceMutation = mutationField("createFace", {
  args: {
    x: intArg({ nullable: false }),
    y: intArg({ nullable: false }),
    w: intArg({ nullable: false }),
    h: intArg({ nullable: false }),
    photoId: intArg({ nullable: false }),
  },
  type: "Face",
  resolve: async (parent, args, ctx) => {
    return createFace({
      x: args.x,
      y: args.y,
      w: args.w,
      h: args.h,
      photoId: args.photoId,
      identityId: null,
      suggestedIdentityId: null,
      suggestedIdentityConfidence: null,
    });
  },
});

export const identityFaceMutation = mutationField("identifyFace", {
  args: {
    faceId: intArg({ nullable: false }),
    identityId: intArg({ nullable: false }),
  },
  type: "Face",
  resolve: (parent, args, ctx) => {
    return identifyFace(args.faceId, args.identityId);
  },
});

export const deleteFaceMutation = mutationField("deleteFace", {
  args: {
    faceId: intArg({ nullable: false }),
  },
  type: "Face",
  resolve: async (parent, args, ctx) => {
    return deleteFace(args.faceId);
  },
});
