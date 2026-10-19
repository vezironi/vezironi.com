import { boolean, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  titleTr: text("title_tr").notNull(),
  titleEn: text("title_en").notNull(),
  bioTr: text("bio_tr").notNull(),
  bioEn: text("bio_en").notNull(),
  github: text("github").notNull(),
  email: text("email").notNull(),
  discordUsername: text("discord_username").notNull(),
  discordId: text("discord_id").notNull(),
  x: text("x").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  logoUrl: text("logo_url").notNull(),
  screenshotUrl: text("screenshot_url").notNull(),
  bannerUrl: text("banner_url"),
  descriptionTr: text("description_tr").notNull(),
  descriptionEn: text("description_en").notNull(),
  tech: text("tech").array().notNull().default([]),
  year: integer("year").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

/** Published npm packages; version, license and downloads are fetched live from npm. */
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  descriptionTr: text("description_tr").notNull(),
  descriptionEn: text("description_en").notNull(),
  homepageUrl: text("homepage_url"),
  repoUrl: text("repo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const references = pgTable("references", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url").notNull(),
  url: text("url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull().unique(),
  roleTr: text("role_tr").notNull(),
  roleEn: text("role_en").notNull(),
  descriptionTr: text("description_tr").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const stackItems = pgTable("stack_items", {
  id: serial("id").primaryKey(),
  category: text("category", { enum: ["tech", "tool"] }).notNull(),
  name: text("name").notNull().unique(),
  iconUrl: text("icon_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleTr: text("title_tr"),
  titleEn: text("title_en"),
  excerptTr: text("excerpt_tr"),
  excerptEn: text("excerpt_en"),
  bodyTr: text("body_tr"),
  bodyEn: text("body_en"),
  tags: text("tags").array().notNull().default([]),
  publishedAt: date("published_at", { mode: "string" }).notNull(),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  captionTr: text("caption_tr"),
  captionEn: text("caption_en"),
  takenAt: date("taken_at", { mode: "string" }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  ipHash: text("ip_hash").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
