"""
This is the one function that stands in for GIPO's real orchestration.

Swap the body of `orchestrate()` for a real call — e.g. a Claude request
that reads the raw text, rewrites it into an optimized prompt, decides
which downstream tool/model fits best, and (optionally) calls that tool
directly. Everything upstream (the messages router) only cares that this
function returns an `OrchestrationResult`, so nothing else needs to change
when you wire the real thing in.
"""

from dataclasses import dataclass


@dataclass
class OrchestrationResult:
    optimized_prompt: str
    recommended_tool: str
    reply: str


def orchestrate(raw_text: str, profound_search: bool = False) -> OrchestrationResult:
    stripped = raw_text.strip()
    optimized_prompt = stripped[:57] + "..." if len(stripped) > 60 else stripped

    tools = (
        ["Perplexity — deep web research", "Claude — cited synthesis"]
        if profound_search
        else ["Claude — reasoning & writing", "GPT-4o — vision & code"]
    )
    recommended_tool = tools[len(raw_text) % len(tools)]

    reply = (
        f"Routed through {recommended_tool}. Here's a response shaped around "
        f"the optimized prompt above."
    )

    return OrchestrationResult(
        optimized_prompt=optimized_prompt,
        recommended_tool=recommended_tool,
        reply=reply,
    )
