// path: engine/fsStorage.ts
import { promises as fs } from "fs";
import * as path from "path";

export interface Storage {
  saveArtifact: (
    filePath: string,
    content: string | Uint8Array,
  ) => Promise<void>;
}

export function createFsStorage(): Storage {
  return {
    async saveArtifact(filePath, content) {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, content);
    },
  };
}
