import { z } from 'zod';

// Method Zod schema
export const MethodSchema = z.enum(["GET", "POST", "PATCH", "PUT", "DELETE", "HEAD"]);

// EndpointInput Zod schema
export const EndpointObjectSchema = z.object({
  name: z.string().describe("Variable name of input"),
  type: z.string().describe("Can be a string, number, boolean, an existing entity or a delination (example : book, bookFindCriterias, book[])")
});

// EndPoint Zod schema
export const EndPointSchema = z.object({
  method: MethodSchema,
  path: z.string().describe("Path of the endpoint into service (DO NOT include the service path here), exemple : /{book_id}, /all, /findByCriteria ..."),
  endpointName: z.string().describe("Example : getBookById, postBook, getAllLibrary ..."),
  description: z.string().describe("Describe what feature is for."),
  actorsAllowed: z.array(z.string()),
  inputs: z.array(EndpointObjectSchema),
  outputs: z.array(EndpointObjectSchema),
  businessRules: z.array(z.string())
});

export const ServiceSchema = z.object({
  serviceName: z.string().describe("Example : Book, Library, Customer..."),
  path: z.string().describe("Exemple : /book, /library..."),
  endpoints: z.array(EndPointSchema)
})

// Service Zod schema
export const ServicesSchema = z.array(ServiceSchema);
