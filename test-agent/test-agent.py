import asyncio
import frontmatter
from claude_agent_sdk import query, ClaudeAgentOptions

post = frontmatter.load("test-agent/test-prompt.md")

agent_details = post.metadata
system_prompt = post.content

