import * as z from "zod";

export const RegisterFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
      description: "Name",
    })
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type TRegisterFormSchema = z.infer<typeof RegisterFormSchema>

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type TLoginFormSchema = z.infer<typeof LoginFormSchema>

