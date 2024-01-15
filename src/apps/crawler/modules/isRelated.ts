import config from "../../../config.js";

export default function isRelated(rawText: string) {
    return config.crawler.keywords.some(keyword => rawText.includes(keyword));
}