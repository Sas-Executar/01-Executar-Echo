# Architecture Sources

Checked: 2026-09-20

1. Claude Platform — Agent Skills overview  
   https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview  
   Used for: required SKILL.md frontmatter, filesystem skill packaging, custom-skill structure, progressive disclosure model.

2. Claude Platform — Skill authoring best practices  
   https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices  
   Used for: concise SKILL.md, third-person description, direct references, scripts for deterministic work, evaluations, progressive disclosure.

3. Claude Platform — Web search tool  
   https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool  
   Used for: current web evidence, cited search results, freshness-sensitive research behavior.

The Skill avoids hard-coding rapidly changing API model/tool versions into its core workflow. Runtime-specific integration should follow the current platform documentation.
