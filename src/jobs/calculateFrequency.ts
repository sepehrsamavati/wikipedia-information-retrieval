import { closeConnection, connect } from "../infrastructure/mongo/connection.js";
import { calculateFrequency, calculateTokenFrequency } from "../infrastructure/mongo/repository/token.js";

await connect();

console.log("Document frequency (in collection)");
await calculateFrequency();

console.log("Token frequency (per document)");
await calculateTokenFrequency();

await closeConnection();
