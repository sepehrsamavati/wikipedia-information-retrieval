import fetchWorker from "./main.worker.js";
import { connect } from "../../infrastructure/mongo/connection.js";
import { setStatusById, takeUrl } from "../../infrastructure/mongo/repository/urlFrontier.js";

await connect();

const doCycle = async () => {
    const urlToCrawl = await takeUrl();

    if (urlToCrawl) {
        let content: string | null = null;

        try {
            content = await fetchWorker([urlToCrawl.url]);
        } catch (e) {
            console.error(e);
            await setStatusById(urlToCrawl._id, "error");
        }

        if (content) {
            debugger
        }
    }

    setTimeout(doCycle, 1e3);
};

doCycle();
