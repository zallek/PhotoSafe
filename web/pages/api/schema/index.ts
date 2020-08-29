import { asNexusMethod } from "@nexus/schema";
import { GraphQLDate } from "graphql-iso-date";

export const GQLDate = asNexusMethod(GraphQLDate, "date");

export * from "./face";
export * from "./identity";
export * from "./photo";
