import type { HTMLElement } from "node-html-parser";

export default function getPageLinks(root: HTMLElement) {
    return root.querySelectorAll("#mw-content-text > * > p a").map(a => ({
        text: a.innerText,
        url: a.attributes.href || "#"
    })).filter(link => link.url.startsWith('/'));
}