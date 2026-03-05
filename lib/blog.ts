import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
  published?: boolean;
};

export type BlogPostListItem = BlogFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostListItem & {
  contentHtml: string;
};

function ensureBlogDir() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function compareByDateDesc(a: BlogPostListItem, b: BlogPostListItem) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getAllPostSlugs() {
  ensureBlogDir();

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ""),
    }));
}

export function getAllPosts(): BlogPostListItem[] {
  ensureBlogDir();

  const fileNames = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    const frontmatter = data as BlogFrontmatter;

    return {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      date: frontmatter.date,
      tags: frontmatter.tags ?? [],
      published: frontmatter.published ?? true,
    };
  });

  return posts.filter((post) => post.published).sort(compareByDateDesc);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  ensureBlogDir();

  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();
  const frontmatter = data as BlogFrontmatter;

  if (frontmatter.published === false) {
    return null;
  }

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    date: frontmatter.date,
    tags: frontmatter.tags ?? [],
    published: frontmatter.published ?? true,
    contentHtml,
  };
}
