const baseSearchUrl = "https://fa.wikipedia.org/wiki/Special:Search?go=Go&search=";
export const getSearchUrl = (word) => baseSearchUrl + word;
export const getSearchResult = (root) => {
    try {
        // @ts-ignore
        return [...root.querySelector(".mw-search-results").childNodes].map(e => e.querySelector("a").attributes.href);
    }
    catch {
        return [];
    }
};
