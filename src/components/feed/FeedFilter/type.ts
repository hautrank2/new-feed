// type.ts
import { z } from "zod";

export const FilterSchema = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  createdBy: z.string().optional(),
});

export type FeedFilterValues = z.infer<typeof FilterSchema>;

export type UserLite = { id: string; name: string };
