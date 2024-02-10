import { closeConnection, connect } from "./connection.js";
import TokenModel from "./models/token.js";
import BigramModel from "./models/bigram.js";
import DocumentModel from "./models/document.js";
import FrequencyModel from "./models/frequency.js";
import UrlFrontierModel from "./models/urlFrontier.js";
import DocumentLinkModel from "./models/documentLink.js";
import DocumentTokenModel from "./models/documentToken.js";

await connect();

const models = [DocumentModel, UrlFrontierModel, TokenModel, BigramModel, FrequencyModel, DocumentTokenModel, DocumentLinkModel];

for (const model of models) {
    await model.ensureIndexes();
}

await closeConnection();
