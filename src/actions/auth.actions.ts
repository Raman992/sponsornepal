"use server";

import { authService, type AuthError } from "@/services/auth.service";
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validated = loginSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await authService.signInWithEmail(
      validated.data.email,
      validated.data.password
    );

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    if (!result.user) {
      return { success: false, error: "Failed to sign in" };
    }

    revalidatePath("/", "layout");
    return { success: true, data: { userId: result.user.id } };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signupAction(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      fullName: formData.get("fullName") as string,
      role: formData.get("role") as "creator" | "brand",
    };

    const validated = signupSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await authService.signUpWithEmail(
      validated.data.email,
      validated.data.password,
      validated.data.fullName,
      validated.data.role
    );

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    if (!result.user) {
      return { success: false, error: "Failed to create account" };
    }

    revalidatePath("/", "layout");
    return { success: true, data: { userId: result.user.id } };
  } catch (error) {
    console.error("Signup action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signOutAction(): Promise<ActionResult> {
  try {
    const result = await authService.signOut();
    
    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Sign out action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validated = forgotPasswordSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await authService.resetPassword(validated.data.email);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Forgot password action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validated = resetPasswordSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await authService.updatePassword(validated.data.password);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Reset password action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      fullName: formData.get("fullName") as string,
      avatarUrl: formData.get("avatarUrl") as string | null,
    };

    const validated = updateProfileSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const updates: { full_name?: string; avatar_url?: string } = {};
    
    if (validated.data.fullName) {
      updates.full_name = validated.data.fullName;
    }
    if (validated.data.avatarUrl !== undefined) {
      updates.avatar_url = validated.data.avatarUrl || undefined;
    }

    const result = await authService.updateProfile(updates);

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Update profile action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCurrentUserAction() {
  try {
    const user = await authService.getCurrentUser();
    return { success: true, data: user };
  } catch (error) {
    console.error("Get current user action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}