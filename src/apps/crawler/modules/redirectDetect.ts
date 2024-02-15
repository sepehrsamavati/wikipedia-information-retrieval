import { parse, type HTMLElement } from "node-html-parser";

export default function redirectDetect(root: HTMLElement) {
    const firstScriptTagCode = root.querySelector('script')?.toString();
    if (!firstScriptTagCode) return null;

    const redirectUrlMatch = firstScriptTagCode.replaceAll(/\n/g, '').match(/"wgInternalRedirectTargetUrl":"([^"]+)"/);
    if (!redirectUrlMatch) return null;

    const path = redirectUrlMatch[1];
    return path;
}
