/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import crypto from "crypto";

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}



export const getHash = (input: string): string => {
  return crypto
    .createHash("sha256") // Create a SHA-256 hash object
    .update(input) // Update the hash with the input string
    .digest("hex"); // Calculate the digest as a hexadecimal string
};
