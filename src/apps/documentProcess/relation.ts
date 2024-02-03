import { closeConnection, connect } from "../../infrastructure/mongo/connection.js";
import { addRelations } from "../../infrastructure/mongo/repository/document.js";

await connect();

await addRelations();

await closeConnection();
