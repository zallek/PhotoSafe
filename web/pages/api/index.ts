import { makeSchema, objectType, asNexusMethod } from "@nexus/schema";
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
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
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
        return prisma.photo.findMany();
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Photo, GQLDate],
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
