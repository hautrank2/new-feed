import { GetColorName } from "hex-color-to-color-name";

export const hexColorToName = (hex: string): string => {
  return GetColorName(hex);
};
