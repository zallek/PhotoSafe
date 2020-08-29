import { makeSchema } from "@nexus/schema";
import { ApolloServer } from "apollo-server-micro";
import path from "path";
import * as allTypes from "./schema";
import Listeners from "./listeners";

export const schema = makeSchema({
  types: allTypes,
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

new Listeners().init();
