import type { PublicMediaDto } from "@webdulich/contracts";

export type MediaClearanceValue = "UNVERIFIED" | "CLEARED" | "BLOCKED";

export interface MediaRow {
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  attribution: string | null;
  clearance: MediaClearanceValue;
}

export function isPublicUrlAllowed(url: string): boolean {
  if (url.length === 0 || url.length > 2048) {
    return false;
  }

  if (hasControlOrSpaceCharacters(url)) {
    return false;
  }

  if (url.startsWith("//")) {
    return false;
  }

  if (url.startsWith("/")) {
    return !url.includes("\\");
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  if (parsed.username !== "" || parsed.password !== "") {
    return false;
  }

  return true;
}

function hasControlOrSpaceCharacters(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    if (code <= 0x20 || code === 0x7f || code === 0xa0) {
      return true;
    }
  }

  return false;
}

export function toPublicMedia(row: MediaRow | null | undefined): PublicMediaDto | null {
  if (!row || row.clearance !== "CLEARED" || !isPublicUrlAllowed(row.publicUrl)) {
    return null;
  }

  return {
    publicUrl: row.publicUrl,
    alt: row.alt,
    width: row.width,
    height: row.height,
    attribution: row.attribution,
  };
}
