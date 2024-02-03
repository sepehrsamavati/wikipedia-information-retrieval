import { closeConnection, connect } from "./connection.js";
import TokenModel from "./models/token.js";
import DocumentModel from "./models/document.js";
import UrlFrontierModel from "./models/urlFrontier.js";
import BigramModel from "./models/bigram.js";

const con = await connect();

await DocumentModel.ensureIndexes();
await UrlFrontierModel.ensureIndexes();
await TokenModel.ensureIndexes();
await BigramModel.ensureIndexes();

await closeConnection();
