import { closeConnection, connect } from "./connection.js";
import TokenModel from "./models/token.js";
import BigramModel from "./models/bigram.js";
import DocumentModel from "./models/document.js";
import UrlFrontierModel from "./models/urlFrontier.js";
import DocumentLinkModel from "./models/documentLink.js";
import DocumentTokenModel from "./models/documentToken.js";
import TokenFrequencyModel from "./models/tokenFrequency.js";

await connect();

const models = [DocumentModel, UrlFrontierModel, TokenModel, BigramModel, TokenFrequencyModel, DocumentTokenModel, DocumentLinkModel];

for (const model of models) {
    await model.ensureIndexes();
}

await closeConnection();
