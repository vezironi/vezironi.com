export const TAGS = {
  settings: "settings",
  projects: "projects",
  references: "references",
  experiences: "experiences",
  stack: "stack",
  posts: "posts",
  gallery: "gallery",
  packages: "packages",
} as const;

export type ContentTag = (typeof TAGS)[keyof typeof TAGS];
