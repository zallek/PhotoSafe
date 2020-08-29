import {
  objectType,
  stringArg,
  intArg,
  queryField,
  mutationField,
} from "@nexus/schema";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Identity = objectType({
  name: "Identity",
  definition(t) {
    t.int("id");
    t.string("name");
    t.list.field("faces", {
      type: "Face",
      resolve: (parent) => {
        return prisma.identity
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

export const identity = queryField("identity", {
  type: "Identity",
  args: {
    identityId: intArg({ nullable: false }),
  },
  resolve: (parent, args, ctx) => {
    return prisma.identity.findOne({
      where: {
        id: args.identityId,
      },
    });
  },
});

export const identities = queryField("identities", {
  type: "Identity",
  list: true,
  resolve: (parent, args, ctx) => {
    return prisma.identity.findMany();
  },
});

export const createIdentity = mutationField("createIdentity", {
  args: {
    name: stringArg({ nullable: false }),
    faceId: intArg(),
  },
  type: "Identity",
  resolve: async (parent, args, ctx) => {
    return prisma.identity.create({
      data: {
        name: args.name,
        faces: args.faceId
          ? {
              connect: [
                {
                  id: args.faceId,
                },
              ],
            }
          : undefined,
      },
    });
  },
});

export const deleteIdentity = mutationField("deleteIdentity", {
  args: {
    identityId: intArg({ nullable: false }),
  },
  type: "Identity",
  resolve: async (parent, args, ctx) => {
    return prisma.identity.delete({
      where: {
        id: args.identityId,
      },
    });
  },
});
