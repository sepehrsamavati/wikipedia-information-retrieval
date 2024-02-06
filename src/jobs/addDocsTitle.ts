import { parse } from "node-html-parser";
import getTitle from "../apps/crawler/modules/getTitle.js";
import { closeConnection, connect } from "../infrastructure/mongo/connection.js";
import DocumentModel from "../infrastructure/mongo/models/document.js";

await connect();

const docs = await DocumentModel.find().select('rawHtml');

let updateCount = 0;

for (const doc of docs) {
    console.log(`${++updateCount}/${docs.length}`);
    await DocumentModel.findByIdAndUpdate(doc._id, {
        title: getTitle(
            parse(doc.rawHtml)
        )
    });
}

await closeConnection();
