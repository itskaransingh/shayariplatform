import * as z from "zod";

const RegisterSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
    description: "Name",
  }).min(3),
  email: z.string().email(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }).min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }).min(6),
})

export  {LoginSchema, RegisterSchema};
