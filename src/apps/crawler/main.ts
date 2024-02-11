import config from "../../config.js";
import { randomUUID } from "node:crypto";
import fetchWorker from "./main.worker.js";
import { connect } from "../../infrastructure/mongo/connection.js";
import { add as addDocument } from "../../infrastructure/mongo/repository/document.js";
import { add as addUrl, addLinkedBy, count, exists, setStatusById, takeUrl } from "../../infrastructure/mongo/repository/urlFrontier.js";

const workerId = `${process.pid}:${randomUUID()}`;
let doNotAdd = false;

await connect();

const doCycle = async () => {
    const urlToCrawl = await takeUrl(workerId);
    let errorOccurred = false;

    if (urlToCrawl) {
        let content: {
            title: string;
            rawHtml: string;
            rawText: string;
            links: {
                text: string;
                url: string;
            }[];
        } | null = null;

        try {
            content = await fetchWorker([urlToCrawl.url]);
        } catch (e) {
            console.error(e);
            errorOccurred = true;
            await setStatusById(urlToCrawl._id, "error");
        }

        if (content) {
            const urlsCount = await count();
            if (urlsCount !== null && !doNotAdd) {
                if (urlsCount < config.crawler.urlFrontierCountLimit) {
                    await Promise.allSettled(content.links.map(async l => {
                        const url = new URL(urlToCrawl.url);
                        // keeping base url info (hostname, ...)
                        url.pathname = l.url;
                        const alreadyAdded = await exists(url.toString());
                        if (alreadyAdded === null)
                            return addUrl({
                                parentUrl: urlToCrawl._id.toString(),
                                url: url.toString(),
                                depth: urlToCrawl.depth + 1,
                                createDate: new Date(),
                                status: "not_visited",
                                linkedBy: [urlToCrawl._id.toString()]
                            });
                        else
                            return addLinkedBy(alreadyAdded._id, urlToCrawl._id);
                    }));
                }
                else {
                    doNotAdd = true;
                    console.warn(`URL frontier filled with ${urlsCount} URLs; Not adding new links...`);
                }
            }
            await addDocument({
                crawlerId: workerId,
                createDate: new Date(),
                processStatus: "not_processed",
                url: urlToCrawl._id.toString(),
                pageRank: 0,
                title: content.title,
                rawHtml: content.rawHtml,
                rawContent: content.rawText,
            });
        }
        if (!errorOccurred)
            await setStatusById(urlToCrawl._id, "visited");
    }

    setTimeout(doCycle, 1e3);
};

doCycle();
