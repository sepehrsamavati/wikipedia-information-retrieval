import type { HTMLElement } from "node-html-parser";

const baseSearchUrl = "https://fa.wikipedia.org/wiki/Special:Search?go=Go&search=";

export const getSearchUrl = (word: string) => baseSearchUrl + word;

export const getSearchResult = (root: HTMLElement) => {
    try {
        return [...(root.querySelector(".mw-search-results") as unknown as HTMLElement).childNodes]
        .map(e => (((e as unknown as HTMLElement).querySelector("a") as unknown as HTMLAnchorElement).attributes as any).href as string);
    } catch {
        return [];
    }
};
