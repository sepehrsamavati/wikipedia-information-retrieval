import fetchWorker from "./main.worker.js";
import { connect } from "../../infrastructure/mongo/connection.js";
import { add, setStatusById, takeUrl } from "../../infrastructure/mongo/repository/urlFrontier.js";

await connect();

const doCycle = async () => {
    const urlToCrawl = await takeUrl();

    if (urlToCrawl) {
        let content: {
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
            await setStatusById(urlToCrawl._id, "error");
        }

        if (content) {
            await Promise.allSettled(content.links.map(l => {
                const url = new URL(urlToCrawl.url);
                url.pathname = l.url;
                return add({
                    url: url.toString(),
                    depth: urlToCrawl.depth + 1,
                    createDate: new Date(),
                    status: "not_visited"
                });
            }));
        }
    }

    setTimeout(doCycle, 1e3);
};

doCycle();
