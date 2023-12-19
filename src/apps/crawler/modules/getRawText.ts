import type { HTMLElement } from "node-html-parser";

export default function getRawText(root: HTMLElement) {
    return root.querySelectorAll("#mw-content-text > * > p").map(p => p.structuredText).join('\n\n');
}