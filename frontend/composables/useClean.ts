import type { LocationQueryValueRaw } from "vue-router";
export function useClean(obj: Record<string, unknown>): Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]> {
  const cleanedObj: Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== "") cleanedObj[key] = value  as LocationQueryValueRaw | LocationQueryValueRaw[];;
  }
  return cleanedObj;
}