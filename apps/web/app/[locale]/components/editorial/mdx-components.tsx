import type { ReactElement, ReactNode } from "react";
import { Mermaid } from "./mermaid";

/**
 * MDX component overrides for public-surface article bodies (blog
 * posts). The only override needed so far: a ` ```mermaid ` fence
 * renders as a real diagram (`<Mermaid>`) instead of a code block.
 * Every other fence keeps `next-mdx-remote`'s default `<pre><code>`.
 */
export const editorialMdxComponents = {
  pre: (props: { children?: ReactNode }) => {
    const child = props.children as
      | ReactElement<{
          className?: string;
          children?: string;
        }>
      | undefined;

    if (
      child &&
      typeof child === "object" &&
      "props" in child &&
      child.props.className === "language-mermaid" &&
      typeof child.props.children === "string"
    ) {
      return <Mermaid chart={child.props.children.trim()} />;
    }

    return <pre {...props} />;
  },
};
