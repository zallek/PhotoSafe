import {
  objectType,
  stringArg,
  intArg,
  queryField,
  mutationField,
} from "@nexus/schema";
import { PrismaClient } from "@prisma/client";
import { createIdentity, deleteIdentity } from "./service";

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

export const identityQuery = queryField("identity", {
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

export const identitiesQuery = queryField("identities", {
  type: "Identity",
  list: true,
  resolve: (parent, args, ctx) => {
    return prisma.identity.findMany();
  },
});

export const createIdentityMutation = mutationField("createIdentity", {
  args: {
    name: stringArg({ nullable: false }),
  },
  type: "Identity",
  resolve: async (parent, args, ctx) => {
    return createIdentity({
      name: args.name,
    });
  },
});

export const deleteIdentityMutation = mutationField("deleteIdentity", {
  args: {
    identityId: intArg({ nullable: false }),
  },
  type: "Identity",
  resolve: async (parent, args, ctx) => {
    return deleteIdentity(args.identityId);
  },
});
