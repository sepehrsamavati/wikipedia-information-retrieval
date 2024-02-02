import { randomUUID } from "node:crypto";
import { connect } from "../../infrastructure/mongo/connection.js";
import { setStatusById, takeDocument } from "../../infrastructure/mongo/repository/document.js";
import { extractPersianWords, halfSpaceToFullSpace, persianToEnglishDigits, removeWikiReferences } from "./modules/base.js";
import { upsert } from "../../infrastructure/mongo/repository/token.js";

const workerId = `${process.pid}:${randomUUID()}`;

await connect();

let insertCount = 0;
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

            const tokens =
                extractPersianWords(content)
                    .filter(word => word.length > 2);

            for (const token of tokens) {
                await upsert(token, document._id);
            }

            await setStatusById(document._id, "processed");
        } catch {
            await setStatusById(document._id, "error");
        }
    }

    setTimeout(doProcessCycle, 1);
};

doProcessCycle();
