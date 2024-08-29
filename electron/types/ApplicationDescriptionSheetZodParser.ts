import { z } from 'zod';

const ApplicationDescriptionSheetSchema = z.object({
  name: z.string().describe("Name of the application"),
  description: z.string().describe("Short description of the application"),
  features: z.array(z.string()).describe("List of features. For each feature, it describes what the feature is and who uses this feature"),
  actors: z.array(z.string()).describe("List of all kinds of actors that use the application")
});

export { ApplicationDescriptionSheetSchema };