import { getPost, getPostsMeta } from "./lib/posts";

export type { Post, PostMeta } from "./lib/posts";

/* -------------------------------------------------------------------------------------------------
 * Content source: local MDX files under packages/cms/content/{blog,legal}.
 * Edited directly in the repo via a normal PR — no CMS account/token needed.
 * -----------------------------------------------------------------------------------------------*/

export const blog = {
  getPosts: () => Promise.resolve(getPostsMeta("blog")),

  getLatestPost: () => {
    const [latest] = getPostsMeta("blog");

    if (!latest) {
      return Promise.resolve(null);
    }

    return getPost("blog", latest.slug);
  },

  /**
   * Frontmatter for the newest post, without compiling its body.
   *
   * getLatestPost() runs the MDX through compileMDX(), which goes
   * through Next's data cache. On a request-time render that cache is
   * not always reachable — production logged "No cache host available"
   * on exactly the renders of "/" that came back 404 — and the failed
   * render falls through to not-found. Callers that only need a title,
   * slug or date should use this instead and never touch the cache.
   */
  getLatestPostMeta: () => Promise.resolve(getPostsMeta("blog")[0] ?? null),

  getPost: (slug: string, components?: Parameters<typeof getPost>[2]) =>
    getPost("blog", slug, components),
};

export const legal = {
  getPostsMeta: () => Promise.resolve(getPostsMeta("legal")),

  getPosts: () => Promise.resolve(getPostsMeta("legal")),

  getPost: (slug: string) => getPost("legal", slug),
};
