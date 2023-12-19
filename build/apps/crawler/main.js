import config from "../../config.js";
import { parse } from "node-html-parser";
import getContent from "./modules/getContent.js";
import { getSearchResult, getSearchUrl } from "./modules/searcher.js";
const rawHtml = await (await fetch(getSearchUrl(config.startWord))).text();
const root = parse(rawHtml, {
    blockTextElements: {
        script: true,
        noscript: true,
        code: true,
        style: false,
    }
});
const links = getSearchResult(root);
console.log(getContent(root));
debugger;
