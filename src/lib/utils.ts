/**
 * Pure utility functions for form handling and post management.
 * These functions have no server dependencies and are fully testable.
 */

import { detectCrisis } from "./crisis";

/**
 * Extract and clean an author name from FormData.
 * Returns null if the name is empty or only whitespace.
 * Maximum length is 60 characters.
 */
export function nameFrom(formData: FormData): string | null {
  const n = String(formData.get("authorName") ?? "").trim().slice(0, 60);
  return n || null;
}

/**
 * Convert a title into a URL-friendly slug.
 * Includes a random suffix for uniqueness.
 */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 70) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

/**
 * Determine the initial status of a new post.
 * Posts containing crisis language are marked as "needs_review".
 * All other posts are marked as "live" immediately.
 */
export function statusForNewPost(body: string): "live" | "needs_review" {
  return detectCrisis(body) ? "needs_review" : "live";
}
