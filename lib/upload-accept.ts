// lib/upload-accept.ts
export const UPLOAD_ACCEPT: Record<string, string> = {
  audio: "audio/*",
  code: ".js,.ts,.tsx,.jsx,.py,.rb,.go,.rs,.java,.cs,.cpp,.c,.sh,.json,.yml,.yaml,.toml,.md",
  image: "image/*",
  text: "text/plain,.md,.csv,.tsv",
  pdf: "application/pdf",
  video: "video/*",
};
