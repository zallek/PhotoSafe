import {
  makeSchema,
  objectType,
  asNexusMethod,
  stringArg,
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
              id: Number(parent.id),
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
              id: Number(parent.id),
            },
          })
          .photo();
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
        photoId: stringArg({ nullable: false }),
      },
      resolve: (parent, args, ctx) => {
        return prisma.photo.findOne({
          where: {
            id: Number(args.photoId),
          },
        });
      },
    });

    t.list.field("photos", {
      type: "Photo",
      resolve: (parent, args, ctx) => {
        return prisma.photo.findMany();
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
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
  types: [Query, Mutation, Photo, Face, GQLDate],
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
