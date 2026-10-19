CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"homepage_url" text,
	"repo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "packages_name_unique" UNIQUE("name")
);
