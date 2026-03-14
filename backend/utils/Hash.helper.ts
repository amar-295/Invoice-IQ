import { createHash, getHashes } from "node:crypto";

export function hashString(input: string, algorithm: string = "sha256"): string {
  if (!getHashes().includes(algorithm)) {
    throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }

  const hash = createHash(algorithm);
  hash.update(input);
  return hash.digest("hex");
}