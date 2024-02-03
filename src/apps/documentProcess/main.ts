import config from "../../config.js";
import { randomUUID } from "node:crypto";
import stemmer from "./modules/stemmer.js";
import { closeConnection, connect } from "../../infrastructure/mongo/connection.js";
import { upsert as upsertToken } from "../../infrastructure/mongo/repository/token.js";
import { upsert as upsertBigram } from "../../infrastructure/mongo/repository/bigram.js";
import { setStatusById, takeDocument } from "../../infrastructure/mongo/repository/document.js";
import { extractPersianWords, halfSpaceToFullSpace, persianToEnglishDigits, removeIgnoredWords, removeWikiReferences } from "./modules/base.js";

const workerId = `${process.pid}:${randomUUID()}`;

await connect();

let insertCount = 0;
let shouldExit = false;
const doProcessCycle = async () => {
    const document = await takeDocument(workerId);

    if (document) {
        console.log(`#${++insertCount}`);
        try {
            let content = document.rawContent;

            // ۱۲۳ -> 123
            content = persianToEnglishDigits(content);

            // I test.[21] Hello -> I test. Hello
            content = removeWikiReferences(content);

            // نرم‌افزار -> نرم افزار
            content = halfSpaceToFullSpace(content);

            // extract only persian chars / remove ignored words / remove short words
            const words =
                removeIgnoredWords(
                    extractPersianWords(content)
                        .filter(word => word.length > 2)
                );

            // get words stem and remove ignored words
            const tokens = removeIgnoredWords(
                words.map(word => stemmer(word))
            );

            let previousToken: string = config.bigramStopChar;

            for (const token of tokens) {
                await Promise.all([
                    upsertBigram([previousToken, token], document._id),
                    upsertToken(token, document._id)
                ]);
                previousToken = token;
            }
            await upsertBigram([previousToken, config.bigramStopChar], document._id);

            await setStatusById(document._id, "processed");
        } catch {
            await setStatusById(document._id, "error");
        }
    } else {
        console.info("No document to process, exiting app");
        shouldExit = true;
    }

    if (shouldExit) {
        await closeConnection();
        process.exit(0);
    }
    else
        setTimeout(doProcessCycle, 1);
};

doProcessCycle();
