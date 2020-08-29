import { asNexusMethod } from "@nexus/schema";
import { GraphQLDate } from "graphql-iso-date";

export const GQLDate = asNexusMethod(GraphQLDate, "date");

export * from "./domains/face/schema";
export * from "./domains/indentity/schema";
export * from "./domains/photos/schema";
