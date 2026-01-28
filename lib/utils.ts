import { supabase } from "./supabase";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicImageUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path; // Already a full URL
  const { data } = supabase.storage.from("course-images").getPublicUrl(path);
  return data.publicUrl;
}

export function getPublicAudioUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data } = supabase.storage.from("course-audio").getPublicUrl(path);
  return data.publicUrl;
}

export async function getSignedImageUrl(
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const { data, error } = await supabase.storage
    .from("course-images")
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    console.error(`Error creating signed URL for ${path}:`, error);
    return null;
  }

  return data.signedUrl;
}

export async function getSignedAudioUrl(
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const { data, error } = await supabase.storage
    .from("course-audio")
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    console.error(`Error creating signed audio URL for ${path}:`, error);
    return null;
  }

  return data.signedUrl;
}
