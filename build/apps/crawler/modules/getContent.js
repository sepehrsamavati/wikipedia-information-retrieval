export default function getContent(root) {
    return root.querySelectorAll("#mw-content-text > * > p").map(p => p.structuredText).join('\n\n');
}
