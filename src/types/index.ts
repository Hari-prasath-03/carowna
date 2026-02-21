import { z } from "zod";
import { signupSchema, verifyOtpSchema } from "./validation-schema";

export type UserRole = "USER" | "VENDOR" | "ADMIN";

// Types

export type User = {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
};

// States

export type AuthActionState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export type ResetPasswordState = {
  success: boolean;
  message?: string;
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
};

export type ForgotPasswordState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
  };
};

// Inputs

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
