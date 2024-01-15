import { parse } from "node-html-parser";
import isRelated from "./modules/isRelated.js";
import isPersian from "./modules/isPersian.js";
import getRawText from "./modules/getRawText.js";
import getPageLinks from "./modules/getPageLinks.js";

export default async function ([url]: [string]) {
    const rawHtml = await (await fetch(url)).text();

    const root = parse(rawHtml, {
        blockTextElements: {
            script: true,
            noscript: true,
            code: true,
            style: false,
        }
    });

    const rawText = getRawText(root);

    if (!isRelated(rawText))
        return null;

    if (!isPersian(rawText))
        return null;

    const childLinks = getPageLinks(root);

    return {
        rawText,
        links: childLinks
    };
}
