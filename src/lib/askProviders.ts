import type { Paper } from "../data/papers";

export function buildAskPrompt(
  paper: Pick<Paper, "title" | "authors" | "year">,
  passage: string,
): string {
  return [
    `I'm reading "${paper.title}" (${paper.authors}, ${paper.year}).`,
    "Please explain this passage in plain language and how it fits the paper's argument:",
    "",
    `"${passage}"`,
  ].join("\n");
}

export function chatGptUrl(prompt: string): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

export function claudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}
