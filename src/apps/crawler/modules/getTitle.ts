import type { HTMLElement } from "node-html-parser";

export default function getTitle(root: HTMLElement) {
    try {
        return root.querySelector("title")?.textContent.split('-').shift()?.trim() ?? "NULL_DOC_TITLE";
    } catch (e) {
        console.error("Getting document title error", e);
        return "GET_DOC_TITLE_ERROR";
    }
}