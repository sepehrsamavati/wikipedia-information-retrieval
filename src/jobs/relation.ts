import { addRelations } from "../infrastructure/mongo/repository/document.js";
import { closeConnection, connect } from "../infrastructure/mongo/connection.js";

await connect();
await addRelations();
await closeConnection();
