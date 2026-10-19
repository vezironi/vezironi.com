CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"company" text NOT NULL,
	"role_tr" text NOT NULL,
	"role_en" text NOT NULL,
	"description_tr" text DEFAULT '' NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "experiences_company_unique" UNIQUE("company")
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"caption_tr" text,
	"caption_en" text,
	"taken_at" date,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"ip_hash" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title_tr" text,
	"title_en" text,
	"excerpt_tr" text,
	"excerpt_en" text,
	"body_tr" text,
	"body_en" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"published_at" date NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"logo_url" text NOT NULL,
	"screenshot_url" text NOT NULL,
	"banner_url" text,
	"description_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"tech" text[] DEFAULT '{}' NOT NULL,
	"year" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "projects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "references" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo_url" text NOT NULL,
	"url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "references_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"title_tr" text NOT NULL,
	"title_en" text NOT NULL,
	"bio_tr" text NOT NULL,
	"bio_en" text NOT NULL,
	"github" text NOT NULL,
	"email" text NOT NULL,
	"discord_username" text NOT NULL,
	"discord_id" text NOT NULL,
	"x" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stack_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"icon_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "stack_items_name_unique" UNIQUE("name")
);
