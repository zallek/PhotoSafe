import {
  makeSchema,
  objectType,
  asNexusMethod,
  stringArg,
  intArg,
} from "@nexus/schema";
import { GraphQLDate } from "graphql-iso-date";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import path from "path";
import { scanPhotos } from "./utils/photo-scanner";

export const GQLDate = asNexusMethod(GraphQLDate, "date");

const prisma = new PrismaClient();

const Photo = objectType({
  name: "Photo",
  definition(t) {
    t.int("id");
    t.string("path");
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

const Face = objectType({
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

const Identity = objectType({
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

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("photo", {
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

    t.list.field("photos", {
      type: "Photo",
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

    t.field("identity", {
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

    t.list.field("identities", {
      type: "Identity",
      resolve: (parent, args, ctx) => {
        return prisma.identity.findMany();
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createFace", {
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

    t.field("deleteFace", {
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

    t.field("createIdentity", {
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

    t.field("identifyFace", {
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

    t.field("deleteIdentity", {
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

    t.list.field("scanPhotos", {
      type: "Photo",
      resolve: async (parent, args, ctx) => {
        await scanPhotos();
        return [];
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Photo, Identity, Face, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), "pages", "api", "nexus-typegen.ts"),
    schema: path.join(process.cwd(), "pages", "api", "schema.graphql"),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: "/api",
});
