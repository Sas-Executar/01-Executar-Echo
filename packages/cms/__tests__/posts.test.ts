import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { type ContentType, getPostsMeta } from "../lib/posts";

/**
 * Every .mdx committed under content/ is expected to become a published
 * page. In production all of /legal/privacy, /legal/terms and
 * /blog/bem-vindo-ao-executar returned 404 while their .mdx sat in the
 * repo, because Next's file tracing does not follow the node:fs reads in
 * lib/posts.ts and dropped them from the serverless bundle (fixed by
 * outputFileTracingIncludes in apps/web/next.config.ts).
 *
 * This asserts the resolution contract — that each file on disk is
 * resolvable and carries the frontmatter a page needs. It cannot see
 * whether a deploy bundled the files; that is the production smoke
 * check's job.
 */
const CONTENT_TYPES: ContentType[] = ["blog", "legal"];
const MDX_EXTENSION = /\.mdx$/;
const contentRoot = path.join(import.meta.dirname, "..", "content");

const filesOnDisk = (type: ContentType): string[] => {
  const dir = path.join(contentRoot, type);

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(MDX_EXTENSION, ""));
};

describe("content resolution", () => {
  test("the repo actually ships content to resolve", () => {
    const total = CONTENT_TYPES.flatMap(filesOnDisk).length;

    expect(total).toBeGreaterThan(0);
  });

  for (const type of CONTENT_TYPES) {
    test(`every ${type} .mdx on disk resolves to a post`, () => {
      const expected = filesOnDisk(type).sort();
      const resolved = getPostsMeta(type)
        .map((post) => post.slug)
        .sort();

      expect(resolved).toEqual(expected);
    });

    test(`every ${type} post carries a non-empty title`, () => {
      for (const post of getPostsMeta(type)) {
        expect(post.title?.length ?? 0).toBeGreaterThan(0);
      }
    });
  }
});
