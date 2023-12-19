import config from "../../../config.js";
export default function isRelated(rawText) {
    return config.keywords.some(keyword => rawText.includes(keyword));
}
