import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import readingTime from "reading-time";

export type ContentType = "blog" | "legal";

export interface PostMeta {
  author?: string;
  awarenessLevel?: string;
  date: string;
  description: string;
  funnelStage?: string;
  image?: string;
  /**
   * Editorial taxonomy, from `#06-PILARES-TAXONOMIA/taxonomia.yaml`
   * (closes gap CMS-02, which noted that frontmatter carried only
   * title/description/date/image while the taxonomy defined seven
   * pillars, eight awareness levels and five funnel stages).
   *
   * All optional: an article that has not been classified is shown
   * unclassified rather than assigned a plausible pillar.
   *
   * Deliberately typed as plain strings here. This package knows about
   * MDX, not about the editorial taxonomy — `@repo/knowledge` owns those
   * vocabularies, and the surfaces that render a pillar resolve it there
   * (`pillarBySlug`, `isKnownPillar`). Importing the taxonomy into the
   * content reader would couple file parsing to editorial policy.
   */
  pillar?: string;
  slug: string;
  tags: string[];
  title: string;
}

export type Post = PostMeta & {
  content: ReactElement;
  readingTimeMinutes: number;
};

interface Frontmatter {
  author?: string;
  awareness_level?: string;
  date?: string;
  description?: string;
  funnel_stage?: string;
  image?: string;
  pillar?: string;
  tags?: string[];
  title: string;
}

const MDX_EXTENSION = /\.mdx$/;

// `import.meta.dirname` isn't populated for this module inside Next's
// Turbopack server bundle (sitemap generation calls into this at build
// time), but `import.meta.url` reliably is — derive the directory from
// that instead.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const getContentRoot = (): string => path.join(moduleDir, "..", "content");

const readSlugs = (type: ContentType): string[] => {
  const dir = path.join(getContentRoot(), type);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(MDX_EXTENSION, ""));
};

const readRaw = (type: ContentType, slug: string): string | null => {
  // Guard against path traversal — slug always comes from a route param.
  if (slug.includes("/") || slug.includes("..")) {
    return null;
  }

  const filePath = path.join(getContentRoot(), type, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf-8");
};

/**
 * Frontmatter keys are snake_case (matching the YAML taxonomy they come
 * from) while the exported type is camelCase (matching the rest of the
 * codebase). Mapping happens here, in one place.
 */
const toTaxonomy = (frontmatter: Frontmatter) => ({
  pillar: frontmatter.pillar,
  awarenessLevel: frontmatter.awareness_level,
  funnelStage: frontmatter.funnel_stage,
  author: frontmatter.author,
  tags: frontmatter.tags ?? [],
});

const toMeta = (slug: string, raw: string): PostMeta => {
  const { data } = matter(raw);
  const frontmatter = data as Frontmatter;

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description ?? "",
    date: frontmatter.date ?? new Date(0).toISOString(),
    image: frontmatter.image,
    ...toTaxonomy(frontmatter),
  };
};

export const getPostsMeta = (type: ContentType): PostMeta[] => {
  const posts = readSlugs(type)
    .map((slug) => {
      const raw = readRaw(type, slug);
      return raw ? toMeta(slug, raw) : null;
    })
    .filter((post): post is PostMeta => post !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getPost = async (
  type: ContentType,
  slug: string
): Promise<Post | null> => {
  const raw = readRaw(type, slug);

  if (!raw) {
    return null;
  }

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: raw,
    options: { parseFrontmatter: true },
  });

  const stats = readingTime(raw);

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description ?? "",
    date: frontmatter.date ?? new Date(0).toISOString(),
    image: frontmatter.image,
    ...toTaxonomy(frontmatter),
    content,
    readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
  };
};
