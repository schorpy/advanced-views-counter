import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string().default(""),
  // status: z.string(),
  // label: z.string(),
  // priority: z.string(),
  status: z.string().default("pending"),
  label: z.string().default(""),
  priority: z.string().default("medium")
})

export type Task = z.infer<typeof taskSchema>
