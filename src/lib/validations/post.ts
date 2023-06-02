import { postTypes } from '@/config/constants';
import { z } from "zod";

export const PostFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(
    ["shayari", "gazal", "kavita", "quotes", "poem", "story", "thaught"],
    {
      required_error: "Please select a type",
    }
  )
});

export type TPostFormSchema = z.infer<typeof PostFormSchema>

export type TPostSchema =  {
  title: string;
  type: string;
  content: string;
  userId: string;
  published?: boolean;
}

// tags?: string[];
// createdAt: string;
// updatedAt: string;